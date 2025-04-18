// in node.js
// require()

// in front-end javascript you can't use require
// you can use import

import { ethers } from "./ethers-6.7.0.min.js"
console.log("ethers", ethers)
let isConnected = false

const connectBtn = document.getElementById("connectBtn")
const fundBtn = document.getElementById("fundBtn")
connectBtn.onclick = connect
fundBtn.onclick = fund

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("I see a metamask!")
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.error("Error connecting to metamask:", error)
      connectBtn.innerHTML = "Error connecting to Metamask"
      return
    }
    updateButtonText(true)
  } else {
    console.log("No metamask!")
    connectBtn.innerHTML = "Please install Metamask"
  }
}

async function checkConnection() {
  if (typeof window.ethereum !== "undefined") {
    let accounts = []
    try {
      accounts = await window.ethereum.request({ method: "eth_accounts" })
    } catch (error) {
      console.error("Error checking connection:", error)
      connectBtn.innerHTML = "Error checking connection"
      return
    }
    updateButtonText(accounts.length > 0)
  }
}

function updateButtonText(isConnect) {
  if (isConnect && isConnected) return

  console.log("Updating button text...")

  connectBtn.innerHTML = isConnect ? "Connected" : "Connect"

  isConnected = isConnect
}

window.onload = checkConnection

window.ethereum.on("accountsChanged", () => {
  console.log("Accounts changed")
  checkConnection()
})

// fund function
async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    // provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with
    // ABI & Address
  }
}

// withdraw
