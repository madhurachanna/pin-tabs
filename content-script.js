const ele = document.createElement('div')
const mainDivStyle = "height: 50px; width: 100vw; position: fixed; top: 0;" +
    " background: #222; display: flex; align-items: center; justify-content: space-between;" +
    " border-bottom: 1px solid silver; z-index: 999999; font-size: 14px !important;"
const buttonStyle = "background: #444; display: inline; border-radius: 5px;" +
	" color: white; padding: 4px 8px; cursor: pointer; display: flex; align-items: center;"
const inputStyle = "background: #333; padding: 8px; border-radius: 5px; outline: none;" +
    " border: 1px solid #444; color: white; width: 250px;"

ele.id = "pin-tab-consent"
ele.style.cssText = mainDivStyle
ele.innerHTML = `
    <div style="display: flex; align-items: center; margin-left: 8px;">
        <img id="pin-tab-logo" style="width: 20px; height: 20px; margin-right: 8px;" src="https://gdurl.com/fUtC" />
        <div>Save this to Pin Tab extension</div>
        <div style="margin: 0px 8px">Name: </div>
        <input id="pin-tab-input-name" type="text" style="${inputStyle}" name="name" placeholder="Enter Name">
        <div style="margin: 0px 8px">URL: </div>
        <input id="pin-tab-input-url" type="text" style="${inputStyle}" name="url" placeholder="Enter URL">
    </div>
    <div style="display: flex; margin-right: 8px;">
        <div style="${buttonStyle} margin-right: 8px;" id="pin-tab-cancel">Cancel</div>
        <div style="${buttonStyle}" id="pin-tab-save">Save</div>
    </div>
`
let body = document.getElementsByTagName('body')[0]
body.appendChild(ele)


// Set inputs
const nameInput = document.getElementById('pin-tab-input-name')
const urlInput = document.getElementById('pin-tab-input-url')
nameInput.value = document.title
urlInput.value = document.URL


// Send message to extension
const cancelBtn = document.getElementById('pin-tab-cancel')
const saveBtn = document.getElementById('pin-tab-save')
const consent = document.getElementById('pin-tab-consent')

async function sendMessage (save) {
    if (save) await browser.runtime.sendMessage({
        saveRequest: true,
        name: nameInput.value,
        url: urlInput.value
    })
    else await browser.runtime.sendMessage({ cancelRequest: true })
    consent.remove()
}

if (cancelBtn) cancelBtn.onclick = () => sendMessage(false)
if (saveBtn) saveBtn.onclick = () =>  sendMessage(true) 

