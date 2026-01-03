## express app

Access with browser http://localhost:8080

# Deploying with Docker
> You must have [Docker](https://docs.docker.com/desktop/) installed beforehand and check if it's installed via `docker --version`.
1. Clone the repository with `git clone git@github.com:smgestupa/express-app.git` and navigate to it: `cd express-app`.
2. Build the container with `docker build -t <YOUR_USERNAME>/express-app`.
3. Run the container with `docker run -it --rm -p 8080:8080 <YOUR_USERNAME>/express-app` -- using `--rm` allows the container to be automatically deleted after stopping.

## Pushing to Docker
1. Login to Docker first with `docker login`.
2. Simply run `docker push <YOUR_USERNAME>/express-app` after logging in to push the newly built image to your personal repository.

# Deploying to AWS Lambda
> You need to prepare an AWS Environment with the permission to create an IAM Role and a Lambda function before proceeding.
1. Generate a new Docker personal access token specifically for this repository where you will then add a new repository secrets for: `DOCKER_USERNAME` and `DOCKER_PASSWORD`.
2. Create a new Identity Provider thru the AWS Management Console with these configurations:
- **Provider type:** OpenID Connect
- **Provider URL:** `https://token.actions.githubusercontent.com`
- **Audience:** `sts.amazonaws.com`
3. Create an IAM role in your AWS environment with the `token.actions.githubusercontent.com` as the **Web identity** or with this trust policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:<YOUR_USERNAME>/express-app:ref:refs/heads/main"
                }
            }
        }
    ]
}
```
4. Add the least amount of permission (or use an AWS-managed permission) to the newly created IAM role to deploy the code to AWS Lambda.
5. The deployment pipeline (`.github/workflows/main.yaml`) will run for every push made towards the `main` branch.