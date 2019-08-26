Lerna Dependencies Generator

Move your monolith dependencies into lerna packages.

Run from the directory that contains your top package.json and your lerna.json.

_Warning! Having a clean repo state highly recommended, so it's easy to compare (and revert) changes._

```shell
$ npx lerna-dependencies-generator
```

This tool will add missing dependencies to your packages package.json. If it finds matches in the top-level package.json, it will reuse that version, to make sure things run the same as if it was using the top-level dependency.

If there is no match, that means we have been using a given dependency explicitly, and we don't know what version, so we will set it to "\*" to have any version match. Those entries should be most probably manually edited.
