import type { PlasmoCSConfig } from "plasmo"
import debounce from "debounce"

export const config: PlasmoCSConfig = {
  matches: ["https://www.coursera.org/*"]
}

let initialised = false

function start() {
  const observer = new MutationObserver(() => {
    const videoPlayerRow = document.getElementById("video-player-row")
    const lectureTitleRow = document.getElementById("video-item-title-and-save-note")

    if (videoPlayerRow && lectureTitleRow) {
      init(videoPlayerRow, lectureTitleRow)
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function init(videoPlayerRow, lectureTitleRow) {
  if (initialised) {
    return
  }

  initialised = true

  const videoPlayerContainer = document.getElementById("video-player-container")
  
  let tabsContainer = lectureTitleRow.nextSibling
  if (tabsContainer) {
    videoPlayerRow.appendChild(tabsContainer)
  } else {
    tabsContainer = videoPlayerContainer.nextSibling
  }
  
  const videoPlayerContainerHeight = videoPlayerContainer.offsetHeight
  const tabList = tabsContainer.firstElementChild
  const transcriptTabPanelId = tabList.nextSibling.id

  applyStyles(videoPlayerContainerHeight, transcriptTabPanelId)
}

function applyStyles(videoPlayerContainerHeight, transcriptTabPanelId) {
  const css = `
    #video-player-row {
      flex-wrap: nowrap;
      gap: 20px;
    }

    #video-player-container + div {
      height: ${videoPlayerContainerHeight}px;
      overflow: scroll;
    }

    #video-player-container + div > :first-child {
      top: 0 !important;
    }

    #${transcriptTabPanelId} > :first-child {
      flex-direction: column;
      flex-wrap: nowrap;
    }

    #${transcriptTabPanelId} button.timestamp {
      margin-right: 0;
      margin-left: 0;
    }`

  let styleElement = document.getElementById("coursera-sidetabs-styles")

  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = "coursera-sidetabs-styles"
    document.head.appendChild(styleElement)
  }

  styleElement.innerHTML = css
}

function restart() {
  initialised = false
  start()
}

function handleNavigation() {
  let currentUrl = location.href

  setInterval(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href
      restart()
    }
  }, 1000);
}

function handleWindowResize() {
  window.addEventListener("resize", debounce(restart, 200))
}

start()
handleNavigation()
handleWindowResize()
