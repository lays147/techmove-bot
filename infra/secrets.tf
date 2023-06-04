resource "aws_ssm_parameter" "telegram_token" {

  name  = "/${local.project}/telegram_token"
  type  = "SecureString"
  value = "foobar"

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}

resource "aws_ssm_parameter" "firebase" {

  name  = "/${local.project}/firebase"
  type  = "SecureString"
  value = "foobar"

  lifecycle {
    ignore_changes = [
      value
    ]
  }
}
