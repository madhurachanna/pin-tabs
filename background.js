// browser.storage.local.set({
//     'websitesToBePinned': []
// })

async function updatePinnedTabs () {
    const websites = await getWebsitesToBePinned()
    const pinnedTabs = await getPinnedWebsites()
    await removeTabs(pinnedTabs.map(t => t.id))
    if (websites && websites.length) {
        websites.forEach( async w => {
            const updatedTabs = await pinTabAndUpdate(w)
        })
    }
    updateBadge()
}

async function onMoved (tabId, info) {
    console.log('movied', tabId, info)
    const pinnedWebsites = await getPinnedWebsites()
    const website = pinnedWebsites.find(w => w.id === tabId)
    if (website) {
        const data = await activateTab(tabId)
        const a = await browser.tabs.executeScript(tabId,{
            file: '/content-script.js',
            allFrames: true
        })
    } else console.log('Tab moved. But not pinned')
}

async function onRuntimeMessage (request, sender, senderResponse) {
    console.log('runtime message')
    console.log(request, sender.tab, senderResponse)
    if (request && request.saveRequest && request.name && request.url) {
        await addWebsitesToBePinned({id: sender.tab.id, name: request.name, url: request.url})
    }
}

async function updateBadge () {
    const count = (await getWebsitesToBePinned()).length
    console.log('updateBadge', count)
    browser.browserAction.setBadgeText({text: count.toString()});
    browser.browserAction.setBadgeBackgroundColor({'color': 'green'});
}

browser.tabs.onRemoved.addListener((tabId) => { updateCount(tabId, true) })
browser.tabs.onCreated.addListener((tabId) => { updateCount(tabId, false) })
browser.tabs.onMoved.addListener((tabId, info) => onMoved(tabId, info))
browser.runtime.onMessage.addListener((r, s, sR) => onRuntimeMessage(r, s, sR));
browser.storage.onChanged.addListener(() => updateBadge())
browser.windows.onCreated.addListener(() => updatePinnedTabs())

updatePinnedTabs()
updateBadge()
