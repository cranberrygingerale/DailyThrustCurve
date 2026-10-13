# Thrust Curve

A daily guessing game: name the rocket motor from its thrust curve. Static site, no backend.

## Host on GitHub Pages

1. Create a repo and commit `index.html` (the only file the site needs).
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Optional: set `SHARE_URL` near the top of the script in `template.html` to your Pages URL, then rebuild, so shared results link back.

## Rebuild the motor data

    npm install thrustcurve-db
    node build.mjs

`build.mjs` reads the `thrustcurve-db` package (a snapshot of ThrustCurve.org), keeps currently produced solid motors, thins each curve to 40 points or fewer, and writes `index.html` from `template.html`. Edit `template.html`, never `index.html`.

The daily schedule is the shuffled motor order baked in at build time. Rebuilding with a newer data snapshot changes which motor falls on which day, so rebuild between puzzles, not mid-day. Puzzle #1 is set by `EPOCH` in the script.

Motor data: ThrustCurve.org, via thrustcurve-db (ISC license).
