# runeicons-vue

Vue 3 components for [Rune Icons](https://runeicons.com): 900+ icons in five styles: normal, duotone, fill, pixelated, and glass.

## Install

```sh
pnpm add runeicons-vue
```

## Usage

```vue
<script setup>
import { RuneIcon } from "runeicons-vue";
</script>

<template>
  <RuneIcon name="tools-house" type="fill" :size="32" />
</template>
```

`name` takes any icon id from the [icon browser](https://runeicons.com). Icons render inline and inherit text color through `currentColor` where the style supports it.

## Props

| Prop   | Type                                                       | Default    |
| :----- | :--------------------------------------------------------- | :--------- |
| `name` | `string`                                                   | required   |
| `type` | `"normal"`, `"duotone"`, `"fill"`, `"pixelated"`, `"glass"` | `"normal"` |
| `size` | `number`                                                   | `24`       |

## Styles

All five styles share the same ids, so switching styles never renames your icon. Outline styles follow the surrounding text color. Glass icons carry their own gradients with safely scoped ids, so any number can share a page.

Helpers are also available for custom rendering:

```ts
import { buildSvg, searchIcons } from "runeicons-vue";
```

## Development

From the repository root (requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh)):

```sh
pnpm install
pnpm --filter runeicons-vue test
```

The test script regenerates icon data, typechecks the source, server-renders the component, and runs the unit tests. Icon data is generated from the repository SVG sources in `public/` by `scripts/build.ts` into `src/icons.generated.ts`, which is not committed.

## License

Apache 2.0. Copyright 2026 Rune Icons Team. Icons come from the [runeicons](https://github.com/Nexvyn/runeicons) repository.
