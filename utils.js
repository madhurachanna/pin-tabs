async function getWebsitesToBePinned () {
    const websites = (await browser.storage.local.get()).websitesToBePinned

    // Set as array by default
    if (!websites || !Array.isArray(websites)) {
        await setWebsitesToBePinned([])
        return []
    }

    return websites
}

async function setWebsitesToBePinned (websites) {
    await browser.storage.local.set({ 'websitesToBePinned': websites})
    return websites
}

async function addWebsitesToBePinned (website) {
    const websites = await getWebsitesToBePinned()
    websites.push(website)
    await setWebsitesToBePinned(websites)
    return websites
}

async function getPinnedWebsites () {
    const websites = await browser.tabs.query({ pinned: true })
    return websites
}

async function removeTabs (tabIds) {
    await browser.tabs.remove(tabIds)
}

async function pinTab (url) {
    const pinnedTab = await browser.tabs.create({ url, pinned: true })
    return pinnedTab
}

async function activateTab (tabId) {
    const pinnedTab = await browser.tabs.update(tabId, { active: true })
    return pinnedTab
}

async function pinTabAndUpdate (website) {
    const pinnedTab = await pinTab(website.url)
    let websitesToBePinned = await getWebsitesToBePinned()
    if (website && website.id) {
        const index = websitesToBePinned.findIndex(w => w.id === website.id)
        if (index > -1) {
            websitesToBePinned[index].id = pinnedTab.id
            websitesToBePinned = await setWebsitesToBePinned(websitesToBePinned)
        } 
    } else {
        websitesToBePinned.push({ ...website, id: pinnedTab.id })
        websitesToBePinned = await setWebsitesToBePinned(websitesToBePinned)
    }
    return websitesToBePinned
}
