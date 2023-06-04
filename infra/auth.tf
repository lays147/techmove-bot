locals {
  github_oidc_domain = "token.actions.githubusercontent.com"
  reponame           = "repo:lays147/techmove-bot:ref:refs/tags/*"
}


resource "aws_iam_openid_connect_provider" "default" {
  url             = "https://${local.github_oidc_domain}"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    sid     = "Github"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.default.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "${local.github_oidc_domain}:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "${local.github_oidc_domain}:sub"
      values   = [local.reponame]
    }
  }
}

resource "aws_iam_role" "this" {
  name               = "${local.project}-assume-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy" "ecr" {
  name   = "${local.project}-ecr-policy"
  role   = aws_iam_role.this.name
  policy = data.aws_iam_policy_document.ecr.json
}
