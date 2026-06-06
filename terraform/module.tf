module "s3" {
  source = "./s3"

  bucket_name = var.bucket_name
}

module "iam" {
  source = "./iam"

  s3_bucket_name = var.bucket_name
}
