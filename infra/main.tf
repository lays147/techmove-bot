terraform {
  backend "s3" {
    bucket = "lays147-terraform"
    key    = "techmove"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  project = "techmove-bot"
}

resource "aws_ecr_repository" "this" {
  name                 = local.project
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

module "runner" {
  source         = "terraform-aws-modules/app-runner/aws"
  version        = "v1.2.0"
  create_service = false

  service_name = local.project
  instance_configuration = {
    cpu    = "1024"
    memory = "2048"
  }
  # IAM instance profile permissions to access secrets
  instance_policy_statements = {
    AllowDescribeSSM = {
      actions   = ["ssm:DescribeParameters", ]
      resources = ["*"]
    }
    AllowGetSSM = {
      actions   = ["ssm:GetParameters", "ssm:GetParameter"]
      resources = [aws_ssm_parameter.telegram_token.arn, aws_ssm_parameter.firebase.arn]
    }
  }
  source_configuration = {
    authentication_configuration = null
    auto_deployments_enabled     = true
    image_repository = {
      image_configuration = {
        port = 3000
        runtime_environment_secrets = {
          TELEGRAM_BOT_TOKEN = aws_ssm_parameter.telegram_token.arn
          FIREBASE_CREDS     = aws_ssm_parameter.firebase.arn
        }
        runtime_environment_variables = {
          NODE_ENV = "production"
        }
      }
      image_identifier      = "${aws_ecr_repository.this.repository_url}:latest"
      image_repository_type = "ECR"
    }
  }

  health_check_configuration = {
    path     = "/health"
    protocol = "HTTP"
  }

  private_ecr_arn        = aws_ecr_repository.this.arn
  create_access_iam_role = true
  depends_on             = [aws_ecr_repository.this]
}
