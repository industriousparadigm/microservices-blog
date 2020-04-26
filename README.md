# Microservices blog

The fun here is all about implementing a microservices-based architecture. Every service should be independent of the others and they should run on Docker containers managed in a Kubernetes cluster.

We are using [skaffold](https://skaffold.dev/) to automate our entire Docker-k8s architecture locally.

I am writing this `README` myself, and the project is part of a [2020 Microservices course](https://www.udemy.com/course/microservices-with-node-js-and-react) by Stephen Grider.

## Functionality overview

This is the simplest Node-React app - posts and comments. Changes persisted in memory only and refresh on reload. Each service stores its own data - yes, we are duplicating database entries in several places!

The `posts` and `comments` services are in charge of handling post and comment creation, and the `moderation` service checks each comment for bad words (currently only 'orange' is banned).

The `query` service is there to quickly serve all the posts with their respective comments to the client.

Finally, the `event-bus` is responsible for informing every other service of relevant events taking place. This is how, for example, the `query` service knows to update its database when the `posts` service creates a new entry in its own database.

## Run the app locally with Skaffold

1. Clone this repo.
2. Make sure Docker and Kubernetes are running on your computer.
3. In all the `infra/k8s` yaml files, my docker ID is used. Use yours instead in all those files. VSCode's Search/Replace tool is your friend.
4. Install Skaffold (`brew install skaffold` on Mac).
5. Run `skaffold dev` in the repo's root folder. This command will take a long time the first time you run it. It may quit with errors - run it again and it should be quick and stable now.
6. If all went well, your Docker containers and Kubernetes services should be running (check with `docker ps` and `kubectl get services`).
7. Open the `hosts` file on your computer (`/etc/hosts` on Mac) and add a new line at the end with `127.0.0.1 posts.com`. This tells your local environment to interpret `http://posts.com` as your app's domain.
8. Visit `http://posts.com` and witness the magic!
9. Make changes to the code in any of the services and Skaffold will automatically rebuild/push your Docker image and adjust your Kubernetes setup for a nodemon-like experience!
10. Skaffold will terminate all your Docker containers and Kubernetes deployments on quit.

## Run the app locally without Skaffold

Skaffold helps with some of the above steps in development. See below how you could start our application without it. Remember to terminate all your containers and deployments at the end.

1. Run steps 1-3 from the section above.
2. For each of our 6 services (`client`, `posts`, `comments`, `moderation`, `query` and `event-bus`), we must build the Docker image and push it to Docker Hub. Go to each service's folder and run:
   - `docker build -t <your docker id>/<service name>`
   - `docker push <your docker id>/<service name>`
3. From the `infra/k8s` folder, run `kubectl apply -f .` to trigger all the Kubernetes deployments for our services.
4. Run steps 6-8 from the section above.
5. If you make changes to the code inside any of the services:
   1. Build the docker container again (see step 2 of this section)
   2. Run `kubectl rollout restart deployment <service-name>-depl.yaml`
