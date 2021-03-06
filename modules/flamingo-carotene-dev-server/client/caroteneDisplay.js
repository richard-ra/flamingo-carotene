export default class CaroteneDisplay {
  constructor (displayPosition) {
    this.domElement = null
    this.domElementMessage = null
    this.domElementMessageIcon = null
    this.bigCarrotIconWrapper = null
    this.fullScreenCloseButton = null

    this.message = null
    this.messageTimeout = null
    this.fullscreenState = false

    this.displayPosition = displayPosition || 'bottom'
    this.displayOppositPosition = this.displayPosition === 'bottom' ? 'top' : 'bottom'

    this.buildProgressData = {
      finished: 0,
      total: 0,
      openJobs: []
    }

    this.createDomElement()
    window.caroteneDisplay = this
    this.onDocumentReady(function () {
      document.body.appendChild(this.domElement)
      document.body.insertBefore(this.domElementCaroteneButton, this.domElement)
    }.bind(this))

    this.displayedMessage = null
    this.updateInterval = window.setInterval(function () {
      this.displayMessage()
    }.bind(this), 500)
  }

  isFullscreen () {
    return this.fullscreenState
  }

  setFullscreen (state, showBigCarrot) {
    clearTimeout(this.messageTimeout)
    clearTimeout(this.fullScreenTimeout)

    if (typeof showBigCarrot === 'undefined') {
      showBigCarrot = true
    }

    this.fullscreenState = state
    if (state) {
      this.fullScreenStartTime = Date.now()
      this._showFullscreen(showBigCarrot)
    } else {
      const startTime = this.fullScreenStartTime || 0
      let timeout = 1000
      if (Date.now() - startTime > timeout) {
        timeout = 0
      }

      this.fullScreenTimeout = setTimeout(_ => {
        this._hideFullscreen()
        this.showMessage(2000)
      }, timeout)
    }
  }

  _showFullscreen (showBigCarrot) {
    if (this.domElement) {
      this.domElement.style[this.displayOppositPosition] = '0px'
    }
    if (this.domElementIcon) {
      this.domElementIcon.style.display = 'flex'
    }
    this.bigCarrotIconWrapper.style.display = showBigCarrot ? 'block' : 'none'
    this.fullScreenCloseButton.style.display = 'block'
  }

  _hideFullscreen () {
    if (this.domElement) {
      this.domElement.style[this.displayOppositPosition] = 'auto'
    }
    if (this.domElementIcon) {
      this.domElementIcon.style.display = 'none'
    }
    this.fullScreenCloseButton.style.display = 'none'
  }

  setReport (reportData) {
    this.buildProgressData = reportData
  }

  setMessage (message) {
    this.message = message
  }

  displayMessage () {
    let message = this.message
    let iconAnimation = 'none'

    if (this.buildProgressData.finished < this.buildProgressData.total) {
      const percent = Math.round(100 / this.buildProgressData.total * this.buildProgressData.finished)
      message = `Build in progress... ${percent}% (${this.buildProgressData.finished}/${this.buildProgressData.total}) ${this.buildProgressData.openJobs.join(', ')}`
      iconAnimation = 'rotatingBigCarrot 2s linear infinite'
    }

    if (this.domElementMessage && this.displayedMessage !== message) {
      this.domElementMessageIcon.style.animation = iconAnimation
      this.domElementMessage.innerHTML = message
      this.displayedMessage = message
    }
  }

  showMessage (milliseconds = 0) {
    if (this.domElement) {
      this.domElement.style.transform = 'translateY(0)'
      this.domElementCaroteneButton.style.transform = 'scale(0)'
      clearTimeout(this.messageTimeout)
      if (milliseconds > 0) {
        this.messageTimeout = setTimeout(_ => {
          if (this.displayPosition === 'bottom') {
            this.domElement.style.transform = 'translateY(100%)'
          }
          if (this.displayPosition === 'top') {
            this.domElement.style.transform = 'translateY(-100%)'
          }
          this.domElementCaroteneButton.style.transform = 'scale(1)'
        }, milliseconds)
      }
    }
  }

  createDomElement (displayPosition) {
    // carrot button
    this.domElementCaroteneButton = document.createElement('div')
    this.domElementCaroteneButton.style.zIndex = 999998
    this.domElementCaroteneButton.style.width = '20px'
    this.domElementCaroteneButton.style.height = '20px'
    this.domElementCaroteneButton.style.height = '20px'
    this.domElementCaroteneButton.style.position = 'fixed'
    this.domElementCaroteneButton.style.left = '20px'
    this.domElementCaroteneButton.style.border = '1px solid #F80'
    this.domElementCaroteneButton.style.backgroundColor = '#000'
    this.domElementCaroteneButton.style.borderRadius = '10px'
    this.domElementCaroteneButton.style[this.displayPosition] = '10px'
    this.domElementCaroteneButton.style.transform = 'scale(1)'
    this.domElementCaroteneButton.style.transition = 'transform 500ms cubic-bezier(0.515, 0.010, 0.425, 1.420) 300ms'
    this.domElementCaroteneButton.innerHTML = this.getSVGCarrotIcon()
    this.domElementCaroteneButton.addEventListener('mouseover', _ => {
      if (!this.isFullscreen()) {
        this.showMessage(0)
      }
    })

    // Container
    this.domElement = document.createElement('div')
    this.domElement.setAttribute('id', 'caroteneDisplay')
    this.domElement.style.position = 'fixed'
    this.domElement.style.zIndex = 999999
    this.domElement.style.left = 0
    this.domElement.style.right = 0
    this.domElement.style[this.displayPosition] = 0
    this.domElement.style.background = 'rgba(0, 0, 0, 0.80)'
    this.domElement.style['border' + this.ucFirst(this.displayOppositPosition)] = '1px solid #F80'
    this.domElement.style.padding = '10px 20px'
    this.domElement.style.transition = 'transform 300ms ease-in-out'
    this.domElement.addEventListener('mouseover', _ => {
      if (!this.isFullscreen()) {
        this.showMessage(0)
      }
    })
    this.domElement.addEventListener('mouseout', _ => {
      if (!this.isFullscreen()) {
        this.showMessage(2000)
      }
    })

    // Icon
    this.domElementIcon = document.createElement('div')
    this.domElementIcon.style.display = 'none'
    this.domElementIcon.style.width = '100%'
    this.domElementIcon.style.height = '100%'
    this.domElementIcon.style.display = 'flex'
    this.domElementIcon.style.position = 'absolute'
    this.domElementIcon.style.alignItems = 'center'
    this.domElementIcon.style.justifyContent = 'center'

    this.bigCarrotIconWrapper = document.createElement('div')
    this.bigCarrotIconWrapper.style.width = '100px'
    this.bigCarrotIconWrapper.style.height = '100px'
    this.bigCarrotIconWrapper.style.animation = 'rotatingBigCarrot 2s linear infinite'
    this.bigCarrotIconWrapper.innerHTML = this.getSVGCarrotIcon()
    this.domElementIcon.appendChild(this.bigCarrotIconWrapper)


    this.fullScreenCloseButton = document.createElement('a')
    this.fullScreenCloseButton.href = ''
    this.fullScreenCloseButton.style.width = '20px'
    this.fullScreenCloseButton.style.height = '20px'
    this.fullScreenCloseButton.style.position = 'absolute'
    this.fullScreenCloseButton.style.top = '10px'
    this.fullScreenCloseButton.style.right = '10px'
    this.fullScreenCloseButton.style.fontSize = '25px'
    this.fullScreenCloseButton.innerHTML = '×'
    this.fullScreenCloseButton.addEventListener('click', (event) => {
      event.preventDefault()
      this.setFullscreen(false)
      this.showMessage(1)
    })
    // Message
    this.domElementMessageContainer = document.createElement('div')
    this.domElementMessageContainer.style.display = 'flex'

    this.domElementMessageIcon = document.createElement('div')
    this.domElementMessageIcon.style.width = '20px'
    this.domElementMessageIcon.style.flexGrow = 0
    this.domElementMessageIcon.style.height = '20px'
    this.domElementMessageIcon.style.marginRight = '20px'
    this.domElementMessageIcon.style.animation = 'none' // rotatingBigCarrot 2s linear infinite'
    this.domElementMessageIcon.innerHTML = this.getSVGCarrotIcon()
    this.domElementMessageContainer.appendChild(this.domElementMessageIcon)

    this.domElementMessage = document.createElement('pre')
    this.domElementMessage.style.color = '#fff'
    this.domElementMessage.style.fontFamily = '"Courier New", Courier, monospace'
    this.domElementMessage.style.fontSize = '14px'
    this.domElementMessage.style.textShadow = '1px 1px 1px black, 1px -1px 1px black, -1px  1px 1px black, -1px -1px 1px black'
    this.domElementMessage.style.flexGrow = 1
    this.domElementMessage.style.margin = 0
    this.domElementMessageContainer.appendChild(this.domElementMessage)

    // Append everything
    this.domElement.appendChild(this.domElementIcon)
    this.domElement.appendChild(this.domElementMessageContainer)
    this.domElement.appendChild(this.fullScreenCloseButton)

    const style = document.createElement('style')
    style.appendChild(document.createTextNode(`@keyframes rotatingBigCarrot { from { transform: rotate3d(0.2, 1, 0.2, 0deg); } to { transform: rotate3d(-0.2, 1, 0.2, 360deg)  } }`))
    this.domElement.appendChild(style)

    this.setFullscreen(false)
  }

  ucFirst (input) {
    return input.charAt(0).toUpperCase() + input.slice(1)
  }

  onDocumentReady (callback) {
    if (document.readyState !== 'loading') {
      // in case the document is already rendered
      callback()
    } else if (document.addEventListener) {
      // modern browsers
      document.addEventListener('DOMContentLoaded', callback)
    } else {
      // IE <= 8
      document.attachEvent('onreadystatechange', function () {
        if (document.readyState === 'complete') callback()
      })
    }
  }

  getSVGCarrotIcon () {
    return `
      <?xml version="1.0" encoding="iso-8859-1"?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 56.538 56.538" style="enable-background:new 0 0 56.538 56.538;" xml:space="preserve">
        <g>
          <path style="fill:#88C057;" d="M34.685,22.808c0,0,12.342-7.316,20.178,3.022c0,0,2.032,2.35,0.47,4.6 c-1.537,2.212-4.968,1.742-6.676-0.603C47.116,27.712,43.403,25.027,34.685,22.808z"/>
          <path style="fill:#88C057;" d="M34.685,22.808c0,0,7.506-12.152-2.145-19.301c0,0-3.185-2.863-6.062-1.844 c-2.676,0.947-2.746,4.678-0.284,6.089C28.892,9.299,32.588,13.163,34.685,22.808z"/>
          <path style="fill:#88C057;" d="M54.604,26.466c0,0,0.067,0.086,0.155,0.205c0.257-0.23,0.506-0.478,0.732-0.768 c2.084-2.67,0.414-4.736,0.414-4.736c-6.186-9.306-20.584,0.807-20.584,0.807c0.693,0.048,1.341,0.11,1.968,0.176 C41.406,20.648,49.11,19.218,54.604,26.466z"/>
          <path style="fill:#A4E869;" d="M32.541,3.507c7.445,5.514,4.681,14.002,3.028,17.596c0.003,0.081,0.009,0.154,0.012,0.235 c0,0,10.275-14.236,1.555-19.836c0,0-2.779-2.377-5.999-0.74c-0.553,0.281-1.03,0.645-1.428,1.056 C31.32,2.412,32.541,3.507,32.541,3.507z"/>
          <path style="fill:#659C35;" d="M50.459,6.131c-3.647-2.363-8.276,1.205-8.276,1.205c-0.768,0.92-1.465,1.91-2.108,2.927 c-0.638,4.649-3.667,9.674-5.173,11.934c-0.089,0.314-0.164,0.589-0.216,0.787c1.745-1.172,6.828-4.343,11.824-5.164 c1.24-0.822,2.422-1.725,3.451-2.705C55.476,9.864,50.459,6.131,50.459,6.131z"/>
          <path style="fill:#A4E869;" d="M34.685,22.808c0,0,12.342-7.316,20.178,3.022c0,0,2.032,2.35,0.47,4.6 c-1.537,2.212-4.968,1.742-6.676-0.603C47.116,27.712,43.403,25.027,34.685,22.808z"/>
          <g>
            <path style="fill:#F2681C;" d="M35.376,21.701c-0.281,0.547-0.472,0.857-0.472,0.857s0.468-0.276,1.272-0.643 C35.915,21.843,35.652,21.772,35.376,21.701z"/>
            <path style="fill:#ED8F20;" d="M41.809,28.277c0.421-1.172,0.395-2.334,0.132-3.429c-1.879-0.789-4.186-1.565-7.037-2.29 c-0.691-3.177-1.556-5.716-2.501-7.762c-1.303-0.453-2.728-0.614-4.17-0.096C23.708,16.326,3.81,44.955,0.089,54.937 c-0.35,0.939,0.387,1.675,1.325,1.325C11.396,52.541,40.183,32.801,41.809,28.277z"/>
          </g>
          <g>
            <path style="fill:#DD7017;" d="M8.236,46.857c-0.674-0.322-1.329-0.715-1.947-1.168c-0.446-0.328-1.071-0.23-1.397,0.215 s-0.23,1.071,0.215,1.397c0.718,0.527,1.481,0.985,2.267,1.36c0.139,0.066,0.286,0.098,0.431,0.098 c0.373,0,0.731-0.21,0.903-0.569C8.945,47.692,8.734,47.094,8.236,46.857z"/>
            <path style="fill:#DD7017;" d="M39.161,27.824c-2.046-0.78-3.945-2.182-5.642-4.167c-0.359-0.42-0.99-0.469-1.41-0.11 c-0.42,0.359-0.469,0.99-0.11,1.41c1.917,2.242,4.087,3.836,6.45,4.737c0.117,0.044,0.237,0.066,0.356,0.066 c0.403,0,0.782-0.246,0.935-0.645C39.936,28.599,39.677,28.021,39.161,27.824z"/>
            <g>
              <path style="fill:#DD7017;" d="M22.722,19.948c0.389,0.101,0.701,0.428,0.748,0.854c0.179,1.632,1.022,3.747,2.505,4.792 c0.451,0.318,0.559,0.942,0.24,1.394c-0.194,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183 c-2.001-1.411-2.996-3.947-3.284-5.847"/>
              <path style="fill:#DD7017;" d="M24.821,27.228c0.175,0.124,0.376,0.183,0.576,0.183c0.314,0,0.624-0.147,0.818-0.423 c0.318-0.452,0.211-1.075-0.24-1.394c-1.482-1.046-2.326-3.161-2.505-4.792c-0.047-0.425-0.359-0.753-0.748-0.854 c-0.385,0.457-0.779,0.931-1.185,1.432C21.825,23.281,22.82,25.817,24.821,27.228z"/>
            </g>
            <g>
              <path style="fill:#DD7017;" d="M30.348,38.578c-1.89-0.306-4.369-1.302-5.758-3.271c-0.318-0.451-0.21-1.075,0.241-1.394 c0.45-0.318,1.075-0.21,1.394,0.241c1.045,1.481,3.16,2.326,4.792,2.505c0.438,0.048,0.766,0.375,0.856,0.782"/>
              <path style="fill:#DD7017;" d="M31.018,36.659c-1.633-0.179-3.748-1.023-4.792-2.505c-0.318-0.451-0.944-0.56-1.394-0.241 c-0.452,0.318-0.56,0.942-0.241,1.394c1.389,1.969,3.868,2.965,5.758,3.271c0.519-0.383,1.028-0.761,1.525-1.136 C31.784,37.034,31.455,36.707,31.018,36.659z"/>
            </g>
            <g>
              <path style="fill:#DD7017;" d="M14.756,30.41c0.399,0.094,0.72,0.424,0.768,0.856c0.112,1.025,0.635,2.349,1.549,2.995 c0.451,0.318,0.559,0.942,0.24,1.394c-0.195,0.276-0.504,0.423-0.818,0.423c-0.199,0-0.4-0.059-0.576-0.183 c-1.328-0.937-2.04-2.56-2.299-3.865"/>
              <path style="fill:#DD7017;" d="M15.92,35.895c0.175,0.124,0.376,0.183,0.576,0.183c0.314,0,0.623-0.147,0.818-0.423 c0.318-0.451,0.211-1.075-0.24-1.394c-0.915-0.646-1.437-1.969-1.549-2.995c-0.047-0.433-0.368-0.763-0.768-0.856 c-0.379,0.535-0.757,1.075-1.136,1.62C13.88,33.335,14.592,34.958,15.92,35.895z"/>
            </g>
            <g>
              <path style="fill:#DD7017;" d="M18.024,47.047c-1.357-0.177-3.244-0.888-4.285-2.365c-0.318-0.452-0.211-1.075,0.24-1.394 c0.452-0.32,1.076-0.21,1.394,0.24c0.646,0.915,1.969,1.437,2.994,1.549c0.549,0.06,0.945,0.554,0.885,1.103 c-0.003,0.031-0.02,0.057-0.026,0.087"/>
              <path style="fill:#DD7017;" d="M18.367,45.078c-1.025-0.112-2.349-0.635-2.994-1.549c-0.318-0.451-0.941-0.56-1.394-0.24 c-0.451,0.318-0.559,0.942-0.24,1.394c1.042,1.477,2.928,2.188,4.285,2.365c0.4-0.257,0.801-0.518,1.202-0.779 c0.006-0.03,0.023-0.056,0.026-0.087C19.313,45.633,18.916,45.138,18.367,45.078z"/>
            </g>
          </g>
        </g>
      </svg>`
  }
}

