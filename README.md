# rns-subdomain-batch

Register subdomains in batch - ✨ invite your users to the experience.

## Setup

```
npm i
```

## Run tests

```
npm test
```

> Remove /build dir

## Deploy

```
truffle migrate [--reset] [--network NETWORK] --rootNode ROOT_NODE
```

- `ROOT_NODE`: the node to register subnodes of.

Example:

```
truffle migrate --reset --network ganache --rootNode javi.rsk
```