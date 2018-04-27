const { Gpio } = require('pigpio')
const express = require('express')
const delay = require('delay')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

let interval
let failingSensors = []

const turnOffEverything = () => {
  Object.keys(led).forEach(colour => {
    led[colour].pwmWrite(0)
  })
}

app.post('/ok', (request, response) => {
  const { sensor } = request.body

  if (!sensor) {
    return response.status(404).end()
  }

  if (failingSensors.includes(sensor)) {
    failingSensors = failingSensors.filter(failingSensor => failingSensor !== sensor)
  }

  if (failingSensors.length > 0) {
    return response.end()
  }

  clearInterval(interval)
  turnOffEverything()

  let brightness = 255

  led.green.pwmWrite(brightness)

  interval = setInterval(() => {
    brightness -= 5
    led.green.pwmWrite(brightness)

    if (brightness === 0) {
      clearInterval(interval)
    }
  }, 100)

  response.send('Yay!')
})

app.post('/warning', (request, response) => {
  const { sensor } = request.body

  if (!sensor) {
    return response.status(404).end()
  }

  if (!failingSensors.includes(sensor)) {
    failingSensors.push(sensor)
  }

  clearInterval(interval)
  turnOffEverything()

  led.yellow.pwmWrite(255)

  interval = setInterval(async () => {
    led.yellow.pwmWrite(0)

    await delay(1000)

    led.yellow.pwmWrite(255)
  }, 5000)

  response.send('Eek!')
})

app.post('/critical', (request, response) => {
  const { sensor } = request.body

  if (!sensor) {
    return response.status(404).end()
  }

  if (!failingSensors.includes(sensor)) {
    failingSensors.push(sensor)
  }

  clearInterval(interval)
  turnOffEverything()

  interval = setInterval(async () => {
    led.red.pwmWrite(255)

    await delay(250)

    led.red.pwmWrite(0)

    await delay(250)
  }, 500)

  response.send('OH NO!')
})

app.post('/unknown', (request, response) => {
  const { sensor } = request.body

  if (!sensor) {
    return response.status(404).end()
  }

  if (!failingSensors.includes(sensor)) {
    failingSensors.push(sensor)
  }

  clearInterval(interval)
  turnOffEverything()

  interval = setInterval(async () => {
    Object.keys(led).forEach(colour => {
      led[colour].pwmWrite(Math.floor(Math.random() * 255) + 0)
    })
  }, 100)

  response.send('???????')
})

const led = {
  red: new Gpio(18, { mode: Gpio.OUTPUT }),
  yellow: new Gpio(23, { mode: Gpio.OUTPUT }),
  green: new Gpio(24, { mode: Gpio.OUTPUT })
}

app.listen(3000, () => {
  console.log('listening on 3000')
})
