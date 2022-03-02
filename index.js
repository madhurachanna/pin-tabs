async function listPinnedTabs () {
    const page = await browser.extension.getBackgroundPage() 
    const websites = await page.getWebsitesToBePinned()

    // Generate the html list of websites
    const container = document.getElementById('pin-tabs-websites-container')
    if (container) {
        container.innerHTML = ''
        if (!websites.length) container.innerHTML = "No tabs found!"
        else for (let i = 0; i < websites.length; i++) {
            const ele = document.createElement('div')
            ele.classList.add('pin-tabs-websites-item')
            ele.style.animationDelay = `${i * 0.05}s`
            ele.innerText = websites[i].name
            ele.title = websites[i].url
            ele.onclick = () => page.activateTab(websites[i].id)

            const deleteBtn = document.createElement('img')
            deleteBtn.src = "./delete.png"
            deleteBtn.id = 'pin-tabs-website-item-delete'
            deleteBtn.onclick = (e) => handlePinnedTabDelete(e, websites[i].id, i) 

            ele.append(deleteBtn)
            container.append(ele)
        }
    }
}

async function  handlePinnedTabDelete (e, tabId, index) {
    e.stopPropagation()
    const page = await browser.extension.getBackgroundPage() 
    const websites = await page.getWebsitesToBePinned()
    await page.removeTabs([tabId])
    websites.splice(index, 1)
    page.setWebsitesToBePinned(websites)
    listPinnedTabs()
}

function showAddWebsiteModal (show) {
    const modal = document.getElementById('websites-add-modal')
    if (show && modal) modal.style.display = 'flex'
    else modal.style.display = 'none'
}

async function handleAddWebsite () {
    const name = document.getElementById('website-name')
    const url = document.getElementById('website-url')

    // Addd new tab to local-storage
    const page = await browser.extension.getBackgroundPage()

    // await page.addWebsitesToBePinned({ name, url, id: createdTab.id })
    const websites = await page.pinTabAndUpdate({ name: name.value, url: url.value })
    console.log('websites after adding', websites)

    name.value = ''
    url.value = 'http://'

    showAddWebsiteModal(false)
    listPinnedTabs()
}

async function handlePopupLoad () {
    listPinnedTabs()
    const addWebsiteBtn1 = document.getElementById('add-website')
    const addWebsiteBtn2 = document.getElementById('modal-add-btn')
    const closeModalBtn = document.getElementById('close-modal')
    if (addWebsiteBtn1) addWebsiteBtn1.addEventListener('click', () => showAddWebsiteModal(true))
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => showAddWebsiteModal(false))
    if (addWebsiteBtn2) addWebsiteBtn2.addEventListener('click', handleAddWebsite)
}

document.addEventListener("DOMContentLoaded", handlePopupLoad);

