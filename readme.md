![Projectmark logo](https://cdn.prod.website-files.com/623b8abd0d554b6266b0b6b5/63c9c7fe8cce38960cea03b1_Logo%20ProjectMark%20Main.svg)

# ProjectMark Challenge

## Intro

This project is a NodeJS using express, Typescript and SQLite to provide an API that controls Topics and Users. It was written following TDD pattern.

The main goal is provide management to a recursive topics hierarchy, where one topic can relate to another.

The topics are updated but their older versions are keep intact. It's possible to retrieve an older version of a specific topic.

Also, it's possible to find the nearest path from one topic to another, since if they have a relation in the hierarchy.

All usecases have been tested. The application was modularized to keep the domain clean. Logging and exception handler were added.

This system was written from scratch, adding every node dependencie as the solution was built.

## Topics

All topics follow the entity structure provided for the test, plus the stack which is an unique for all versions of a topic so it can relate all versions. I thought about either creating a composite key with id and version, but the documentation says parentTopicId for relation, which needs to be unique. I also thought about a personalized id having some unique key and the version, but aditional logic and validation besides data would be needed and would have performance issues.
Also added a user to be the author of a topic, and added permissions:

- Viewer users cannot create topics
- Author users only can edit their own topics
- Admin can edit any topic

It's not possible to delete a topic, only edit it
creating a new version.

The tree only shows current topics (topics in their last version). The path also only works with current topics ids. When a topic is updated, all childs are updated to relate to that topic, even in their older versions, I thought of the relation as a pointer, so it's updating the reference to the new version.

Resources are also replicated, but the edited topic must have its resources listed and updated if needed as well.

## Resources

Resources types were created in a more generic way, they are Article, Video, Document or Audio.

## Users

The first thing to create is an user, setting it role. After that, topics can be created and edited.

## How to run

You can either run in Docker by typing `docker-compose up -d` or run locally by performing `npm install`
and after `npm run start`.

Default port is `3000` and you can change it by adding a .env with PORT and editing Docker files.

In the project root folder is an Insomnia collection where you can see all endpoints.

When first run, the DB will be created in the root folder and it will be blank.

List of endpoints:

| Endpoint  | Verb | Description |
| ------------- |:-------------:|:-------------:|
| /users      | POST     | Creates a user |
| /topics      | POST     | Creates a topic |
| /topics/:id      | PATCH     | Updates a topic |
| /topics | GET | Gets a topic, if you provide a version, it will return that specific version |
| /topics/children | GET | Gets a topic and all it recursive children |
| /topics/path | GET | Provides the shortest path between two given topics, going from the first to the last |
| /topics/all | GET | Gets all topics in a simple list |
