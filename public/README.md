# Public assets

Every folder here is an empty drop zone. Nothing in the site references a real
file yet — each media slot renders a placeholder until you set its `src` in the
matching data file.

| Folder          | What goes here                          | Referenced from                            |
| --------------- | --------------------------------------- | ------------------------------------------ |
| `images/`       | Logo, Open Graph and Twitter cards      | `data/company.ts`, `constants/site.ts`     |
| `videos/`       | Project clips and the services showreel | `data/projects.ts`, `data/content.ts`      |
| `icons/`        | Favicon, PWA and Apple touch icons      | `constants/site.ts`, `app/manifest.ts`     |
| `projects/`     | Project stills                          | `data/projects.ts`                         |
| `services/`     | Service imagery                         | `data/services.ts`                         |
| `placeholders/` | Temporary stand-in files, if you use any | —                                         |

## Expected files

These paths are already wired up. Drop a file in and it appears — no code change.

```
public/images/og-image.png          1200 × 630   Open Graph card
public/images/twitter-image.png     1200 × 630   Twitter card
public/icons/icon-192.png            192 × 192   PWA icon (optional)
public/icons/icon-512.png            512 × 512   PWA icon (optional)
```

The two social cards are referenced by `constants/site.ts`. The PWA icons are
optional: the manifest currently points at `app/icon.svg`, which always exists —
see the comment in `app/manifest.ts` for how to switch it to the PNGs.

The browser tab icon is not in this folder — it uses the App Router file
convention. Replace `app/icon.svg` with your mark, and add `app/apple-icon.png`
(180 × 180) for the iOS home screen.

For the brand mark, add `public/images/krl-logo.svg` and set
`company.logo.src` in `data/company.ts`.
