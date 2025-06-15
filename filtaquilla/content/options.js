/*
 ***** BEGIN LICENSE BLOCK *****
 * This file is part of FiltaQuilla, Custom Filter Actions, by Mesquilla.
 *
 * FiltaQuilla is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * You should have received a copy of the GNU General Public License
 * along with FiltaQuilla.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is FiltaQuilla code.
 *
 * The Initial Developer of the Original Code is
 * Kent James <rkent@mesquilla.com>
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK *****
 */

 /* 
   globals
     Preferences,

 */
 
Services.scriptloader.loadSubScript("chrome://filtaquilla/content/filtaquilla-util.js") // FiltaQuilla object
// const util = FiltaQuilla.Util;


async function onLoad() {
  // disable items that are not valid in current core version
  let haveActionNeedsBody = true,
      haveDetachToFile = true,
      detachElement = document.getElementById("checkDetachAttachmentsEnabled");
      
  FiltaQuilla.Util.addonInfo = await FiltaQuilla.Util.notifyTools.notifyBackground({ func: "getAddonInfo" });
  
  detachElement.disabled = (haveDetachToFile || detachElement.checked) ? false : true;

  let javascriptActionBody = document.getElementById("checkJavascriptActionBodyEnabled");
  javascriptActionBody.disabled = haveActionNeedsBody || javascriptActionBody.checked ? false : true;
  let verPanel = document.getElementById("fq-options-header-version");
  verPanel.textContent = FiltaQuilla.Util.Version;
  
}

// eslint-disable-next-line no-unused-vars
function onVersionClick() {
  let pureVersion = FiltaQuilla.Util.VersionSanitized,
      versionPage = "https://quickfilters.quickfolders.org/fq-versions.html#" + pureVersion;
  FiltaQuilla.Util.openLinkInTab(versionPage);
  window.close();
}

// eslint-disable-next-line no-unused-vars
function loadPreferences() {
  if (typeof Preferences == 'undefined') {
    FiltaQuilla.Util.logToConsole("Preferences is not defined - this shouldn't happen!");
    return;
  }	
  FiltaQuilla.Util.logDebug("loadPreferences - start:");
  
  let myprefElements = document.querySelectorAll("[preference]"),
      foundElements = {};
  
  for (let myprefElement of myprefElements) {
    let legacyPrefId = myprefElement.getAttribute("preference");
    foundElements[legacyPrefId] = myprefElement;
  }

  let myprefs = document.getElementsByTagName("preference");
  let prefArray = [];
  if (myprefs.length) {
    for (let it of myprefs) {
      let p = new Object({ id: it.getAttribute('name'), 
                name: it.getAttribute('name'),
                type: it.getAttribute('type') });
      // not supported
      // if (it.getAttribute('instantApply') == "true") p.instantApply = true;
      prefArray.push(p);
        // manually change the shortname in the preference attribute to the actual
      // preference "id" (as in the preference manager)
      foundElements[it.id].setAttribute("preference", it.getAttribute("name"));
    }
    
    
    FiltaQuilla.Util.logDebug("Adding " + prefArray.length + " preferences to Preferences loader…")
    if (Preferences) {
      Preferences.addAll(prefArray);
    }
  }
  
  if(!Preferences.get("extensions.filtaquilla.print.enabled").value) {
    document.getElementById("checkPrintToolsEnabled").disabled = true;
  }
  let printOption = document.getElementById("checkPrintEnabled");
  printOption.addEventListener("click",
    (event) => {
      document.getElementById("checkPrintToolsEnabled").disabled = !(event.target.checked);
    }
  );
  
  if(!Preferences.get("extensions.filtaquilla.runFile.enabled").value) {
    document.getElementById("checkRunFileUnicode").disabled = true;
  }
  let checkRunFileOption =  document.getElementById("checkRunFileEnabled");
  checkRunFileOption.addEventListener("click",
    (event) => {
      document.getElementById("checkRunFileUnicode").disabled = !(event.target.checked);
    }
  );
    
  FiltaQuilla.Util.logDebug("loadPreferences - finished.");
}

function onl10n() {
  // [mx-l10n]
  FiltaQuilla.Util.localize(window); // , {extra2: 'qf.label.donate'}
}

window.addEventListener("load", async () => {
  // eslint-disable-next-line no-unused-vars
  let val = await onLoad(); // If this pauses, then the onload handler will move onto the next item (it doesn't block).
  // callMyAsyncFunction has been completed.
}, { once: true });

window.document.addEventListener('DOMContentLoaded', 
  async () => {
  onl10n(); // If this pauses, then the onload handler will move onto the next item (it doesn't block).
},  { once: true });


window.addEventListener("unload", async () => {
  let observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
  observerService.notifyObservers(null, "filtaquilla-options-changed", null);
}, { once: true });


// vim: set expandtab tabstop=2 shiftwidth=2:

