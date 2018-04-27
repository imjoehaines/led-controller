# sensu-led-controller

An Express based API for controlling LEDs in response to a Sensu handler, using a Raspberry Pi

## Setup

- Connect three LEDs to a Raspberry Pi's GPIO headers:
  1. a green LED to GPIO pin 24
  1. a yellow LED to GPIO pin 23
  1. a red LED to GPIO pin 18
- Run `yarn` or `npm install`
- Start the server with `node index.js`

## Usage

POST a json encoded message with a `sensor` property to one of the four endpoints to set the status of a sensor

e.g. to set a sensor called "test" to "ok" do the following:

```shell
curl -X POST -d '{"sensor": "test"}' <API url>
```

## Endpoints

### `/ok`

An exit code of 0; everything is good!

This will turn on the green LED and fade it out over a few seconds

### `/warning`

An exit code of 1; something is stuggling, but not broken completely

This will turn on the yellow LED and make it blink slowly forever

### `/critical`

An exit code of 2; things might literally be on fire

This will turn on the red LED and make it blink quickly forever

### `/unknown`

Any other exit code; no one knows what's going on

This will randomly turn on (and adjust the brightness of) all the LEDs
