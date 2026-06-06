resource "aws_iam_user" "microcms_backup" {
  name = "nextblogapp-microcms-backup"
}

resource "aws_iam_policy" "microcms_backup_s3_put_object" {
  name = "nextblogapp-microcms-backup-s3-put-object"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "s3:PutObject",
        Resource = "arn:aws:s3:::${var.s3_bucket_name}/*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "microcms_backup_s3_put_object" {
  user       = aws_iam_user.microcms_backup.name
  policy_arn = aws_iam_policy.microcms_backup_s3_put_object.arn
}
