# Hello Everyone

First you should installed node and mongodb in your machine

1 - npm install --force

2 - create an .env file in server and set environment variable on it

<pre>
PORT=8000
NODE_ENV=dev
DB_URL=(your data base link)
BASE_URL=http://localhost:8000
JWD_EXPIRE_DATE=90d
JWD_SECRET_KEY=eyJhbGciOiJIUzFAOJFPOANiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OasdjaoisjdSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ  
EMAIL=(your email that you want to send from this when client click on forgetPassword)
PASSWORD_EMAIL=(key from this email)
</pre>


3 - create a folder /src/uploads

4 - create three (folder || directories) in uploads => (Category & meals & QRs) with sensitive case

5 - npm run dev


#### now you can use server without any problems with best wishes 🤩🎉
