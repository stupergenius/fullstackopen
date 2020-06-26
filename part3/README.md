## Deployment

Setup the gcloud CLI as recommended by google. Setup a project and add a GAE application.

Then, within this folder, follow the process:

1. cd into the api folder:
   1. Run: `cp env_variables.sample.yaml env_variables.yaml`
   1. Fill out variable(s) with appropriate values and save file
   1. Then run: `npm run deploy`
2. cd into the web folder and run:
   1. `npm run deploy`
3. cd into the root (part3) directory and run:
   1. `gcloud app deploy dispatch.yaml`

The gcloud tool will return the url for the deployment where the applications can be viewed.

An existing deployment of the application can be viewed at:

https://fullstackopen-phonebook.ue.r.appspot.com