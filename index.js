let isConnected = false

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    console.log("I see a metamask!")
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.error("Error connecting to metamask:", error)
      document.getElementById("connectBtn").innerHTML = "Error connecting to Metamask"
      return
    }
    updateButtonText(true)
  } else {
    console.log('No metamask!')
    document.getElementById("connectBtn").innerHTML = "Please install Metamask"
  }
}

async function checkConnection() {
  if (typeof window.ethereum !== 'undefined') {
    let accounts = []
    try {
      accounts = await window.ethereum.request({ method: "eth_accounts" })
    } catch (error) {
      console.error("Error checking connection:", error)
      document.getElementById("connectBtn").innerHTML = "Error checking connection"
      return 
    }
    updateButtonText(accounts.length > 0)
  }
}

function updateButtonText(isConnect) {
  if (isConnect && isConnected) return
  
  console.log("Updating button text...")

  const button = document.getElementById('connectBtn')
  button.innerHTML = isConnect ? "Connected" : "Connect"
  
  isConnected = isConnect
}

window.onload = checkConnection

window.ethereum.on("accountsChanged", () => {
  console.log("Accounts changed")
  checkConnection()
})