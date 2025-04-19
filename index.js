// in node.js
// require()

// in front-end javascript you can't use require
// you can use import

import { ethers } from "./ethers-6.7.0.min.js"
import { contractAddress, abi } from "./constants.js"

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
async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== "undefined") {
    // provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with
    // ABI & Address

    // see: https://docs.ethers.org/v6/migrating/#migrate-providers
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    console.log("🚀 ~ fund ~ signer:", signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    console.log("🚀 ~ fund ~ contract:", contract)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      // listen for the tx to be mined
      // or listen for an event <- we haven't learned about yet!

      // hey, wait for this TX to finish
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch (error) {
      console.error("Error funding:", error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log("transactionResponse", transactionResponse)
  console.log(`Mining ${transactionResponse.hash}...`)
  // create a listener for the blockchain
  // listen for this transaction to finish
  return new Promise((resolve) => {
    // provider.once(transactionResponse.hash, async (transactionReceipt) => {
    //   console.log(
    //     `Completed with ${await transactionReceipt.confirmations()} confirmations`,
    //   )
    //   resolve()
    // })
    const listener = async (transactionReceipt) => {
      const confirmations = await transactionReceipt.confirmations()
      console.log(`Completed with ${confirmations} confirmations`)
      if (confirmations >= 1) {
        resolve()
        provider.off(transactionResponse.hash, listener)
      }
    }
    provider.on(transactionResponse.hash, listener)
  })
}

// withdraw
