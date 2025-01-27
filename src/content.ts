import type { PlasmoCSConfig } from "plasmo"

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
  const tabsContainer = lectureTitleRow.nextSibling
  videoPlayerRow.appendChild(tabsContainer)

  const videoPlayerContainerHeight = videoPlayerContainer.offsetHeight
  const tabList = tabsContainer.firstElementChild
  const transcriptTabPanelId = tabList.nextSibling.id

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

  const styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  styleElement.innerHTML = css
  document.head.appendChild(styleElement)
}

function startOnNavigation() {
  let currentUrl = location.href

  setInterval(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href
      initialised = false
      start()
    }
  }, 1000);
}

start()
startOnNavigation()
