/*
  globals 
    pref
 */

// See http://kb.mozillazine.org/Localize_extension_descriptions
pref("extensions.filtaquilla@mesquilla.com.description", "chrome://filtaquilla/locale/filtaquilla.properties");
// the maximum number of items to scan in a thread search
pref("extensions.filtaquilla.maxthreadscan", 20);
// filter actions
pref("extensions.filtaquilla.attachmentTimeoutMs", 25000); // sync attachment saving. timeout per email
pref("extensions.filtaquilla.subjectAppend.enabled", false);
pref("extensions.filtaquilla.subjectSuffix.enabled", false);
pref("extensions.filtaquilla.removeKeyword.enabled", false);
pref("extensions.filtaquilla.removeFlagged.enabled", false);
pref("extensions.filtaquilla.markUnread.enabled", false);
pref("extensions.filtaquilla.markReplied.enabled", false);
pref("extensions.filtaquilla.noBiff.enabled", false);
pref("extensions.filtaquilla.copyAsRead.enabled", false);
pref("extensions.filtaquilla.launchFile.enabled", true);
pref("extensions.filtaquilla.runFile.enabled", false);
pref("extensions.filtaquilla.runFile.unicode", false); // [issue 102]
pref("extensions.filtaquilla.trainAsJunk.enabled", false);
pref("extensions.filtaquilla.trainAsGood.enabled", false);
pref("extensions.filtaquilla.print.enabled", true);
pref("extensions.filtaquilla.print.enablePrintToolsNG", false);
pref("extensions.filtaquilla.print.allowDuplicates", false);
pref("extensions.filtaquilla.print.delay", 10); // test
pref("extensions.filtaquilla.addSender.enabled", false);
pref("extensions.filtaquilla.saveAttachment.enabled", false);
pref("extensions.filtaquilla.detachAttachments.enabled", false);
pref("extensions.filtaquilla.fileNames.spaceCharacter", " ");
pref("extensions.filtaquilla.fileNames.maxLength", 60);
pref("extensions.filtaquilla.fileNames.whiteList", "");
pref("extensions.filtaquilla.javascriptAction.enabled", false);
pref("extensions.filtaquilla.javascriptActionBody.enabled", false);
pref("extensions.filtaquilla.tonequilla.enabled", false);
pref("extensions.filtaquilla.tonequilla.soundDelay", 100);
pref("extensions.filtaquilla.saveMessageAsFile.enabled", false);
pref("extensions.filtaquilla.moveLater.enabled", false);
pref("extensions.filtaquilla.regexpCaseInsensitive.enabled", true);
pref("extensions.filtaquilla.regexpHeader.addressMultiLine", false); // [issue 329]
pref("extensions.filtaquilla.archiveMessage.enabled", false);
pref("extensions.filtaquilla.smarttemplates.fwd.enabled", false);
pref("extensions.filtaquilla.smarttemplates.rsp.enabled", false);

// search terms
pref("extensions.filtaquilla.SubjectRegexEnabled", true);
pref("extensions.filtaquilla.BodyRegexEnabled", true);
pref("extensions.filtaquilla.SubjectBodyRegexEnabled", false);
pref("extensions.filtaquilla.HeaderRegexEnabled", false);
pref("extensions.filtaquilla.JavascriptEnabled", false);
pref("extensions.filtaquilla.SearchBccEnabled", true);
pref("extensions.filtaquilla.FolderNameEnabled", false);
pref("extensions.filtaquilla.ThreadHeadTagEnabled", false);
pref("extensions.filtaquilla.ThreadAnyTagEnabled", false);

// debug
pref("extensions.filtaquilla.debug", false);
pref("extensions.filtaquilla.debug.attachments", false);
pref("extensions.filtaquilla.debug.firstrun", false);
pref("extensions.filtaquilla.debug.notifications", false);
pref("extensions.filtaquilla.debug.PrintingToolsNG", false);
pref("extensions.filtaquilla.debug.SmartTemplates", false);
pref("extensions.filtaquilla.debug.regexSubject", false);
pref("extensions.filtaquilla.debug.regexHeader", false);
pref("extensions.filtaquilla.debug.regexBody", false);
pref("extensions.filtaquilla.debug.regexBody_parts", false);
pref("extensions.filtaquilla.debug.mimeBody", false);
pref("extensions.filtaquilla.debug.isLocal", false);
pref("extensions.filtaquilla.debug.sounds", false);


// upgrade handling stuff
pref("extensions.filtaquilla.installDate", "");
pref("extensions.filtaquilla.firstRun", true);
pref("extensions.filtaquilla.version", "?");

// vim: set expandtab tabstop=2 shiftwidth=2
