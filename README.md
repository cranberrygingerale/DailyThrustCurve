# Thrust Curve Daily

**Name the rocket motor from its thrust curve.** A new puzzle every day.

▶ **Play: https://cranberrygingerale.github.io/DailyThrustCurve/**

Each day the game shows the thrust curve of a real, currently produced hobby rocket motor, from tiny Estes A motors up to O-class monsters. You have six guesses to name it.

## How to play

- The chart shows the mystery motor's thrust over time. Time is labeled, but the thrust scale stays hidden until the round ends.
- Type a motor name or designation (`J350`, `Estes C6`, `AeroTech H128`…) and pick it from the list.
- Each guess is drawn on top of the mystery curve at true scale, so you can compare peak thrust, burn time and total area. Tap a guess's name to bring its curve back.
- Every guess gets a row of clues for maker, impulse class, average thrust, burn time, diameter and propellant:
  - 🟩 **Green**: a match (thrust and burn time within 5%).
  - 🟨 **Yellow**: close (one impulse class away, thrust or burn time within 25%, or the next motor diameter over).
  - ⬜ **Plain**: off.
  - **↑ / ↓**: the mystery motor's value is higher or lower than your guess.
- A new motor arrives at midnight, your local time. Once you've finished the daily puzzle, you can keep going with unlimited practice rounds, which don't count toward your streak.

When you finish, **Copy result** gives you a spoiler-free grid to share:

```
Thrust Curve Daily #5 4/6
⬜⬜🟨⬜⬜⬜
🟩⬜⬜⬜⬜⬜
⬜⬜⬜⬜⬜⬜
🟩🟩🟩🟩🟩🟩
https://cranberrygingerale.github.io/DailyThrustCurve/
```

## Privacy

There are no accounts, ads, analytics or cookies. Your stats and streak are stored only in your browser's local storage. The page itself is served by GitHub Pages, and its fonts come from Google Fonts. See the [Privacy Notice](PRIVACY.md).

## Running it locally

The game is a single static page. To play offline, open `index.html` in a browser.

To change the game or refresh the motor data, you need [Node.js](https://nodejs.org/):

```sh
npm install
node build.mjs
```

`build.mjs` reads the motor database, keeps currently produced solid motors, simplifies each curve to 40 points or fewer, and writes `index.html` from `template.html`. Make your changes in `template.html`. `index.html` is generated and gets overwritten on every build.

The daily schedule is a fixed shuffle of the motor list, set at build time. Rebuilding with newer motor data changes which motor lands on which day, so avoid publishing a rebuild in the middle of a puzzle day.

## Credits

- Motor data and thrust curves: [ThrustCurve.org](https://www.thrustcurve.org/) by John Coker, via the [thrustcurve-db](https://github.com/broofa/thrustcurve-db) package. Report data errors to ThrustCurve.org.
- Fonts: Chakra Petch, IBM Plex Mono and IBM Plex Sans, via Google Fonts (SIL Open Font License).

Thrust Curve Daily is an independent fan project. It isn't affiliated with ThrustCurve.org or any motor manufacturer. Motor data is for fun only, not for flight planning. See the [Terms of Use](TERMS.md).

## License

The game's code is released under the [MIT License](LICENSE). The motor data isn't covered by that license; it belongs to ThrustCurve.org and its contributors.
