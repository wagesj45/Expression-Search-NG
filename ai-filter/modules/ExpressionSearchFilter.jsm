"use strict";
var { ExtensionParent } = ChromeUtils.importESModule("resource://gre/modules/ExtensionParent.sys.mjs");
var { MailServices }    = ChromeUtils.importESModule("resource:///modules/MailServices.sys.mjs");
var { Services }        = globalThis || ChromeUtils.importESModule("resource://gre/modules/Services.sys.mjs");
var { NetUtil }         = ChromeUtils.importESModule("resource://gre/modules/NetUtil.sys.mjs");
var { MimeParser }      = ChromeUtils.importESModule("resource:///modules/mimeParser.sys.mjs");

var EXPORTED_SYMBOLS = ["AIFilter", "ClassificationTerm"];

class CustomerTermBase {
  constructor(nameId, operators) {
    this.extension = ExtensionParent.GlobalManager.getExtension("ai-filter@example");
    this.id = "aifilter#" + nameId;
    this.name = this.extension.localeData.localizeMessage(nameId);
    this.operators = operators;
    this.cache = new Map();
  }
  getEnabled() { return true; }
  getAvailable() { return true; }
  getAvailableOperators() { return this.operators; }
}

function getPlainText(msgHdr) {
  let folder = msgHdr.folder;
  if (!folder.getMsgInputStream) return "";
  let reusable = {};
  let stream = folder.getMsgInputStream(msgHdr, reusable);
  let data = NetUtil.readInputStreamToString(stream, msgHdr.messageSize);
  if (!reusable.value) stream.close();
  let parser = Cc["@mozilla.org/parserutils;1"].getService(Ci.nsIParserUtils);
  return parser.convertToPlainText(data,
    Ci.nsIDocumentEncoder.OutputLFLineBreak |
    Ci.nsIDocumentEncoder.OutputNoScriptContent |
    Ci.nsIDocumentEncoder.OutputNoFramesContent |
    Ci.nsIDocumentEncoder.OutputBodyOnly, 0);
}

let gEndpoint = "http://127.0.0.1:5000/v1/classify";
function setConfig({ endpoint } = {}) {
  if (endpoint) {
    gEndpoint = endpoint;
  }
}

function buildPrompt(body, criterion) {
  return `<|im_start|>system
You are an email-classification assistant.
Read the email below and the classification criterion provided by the user.

Return ONLY a JSON object on a single line of the form:
{"match": true} - if the email satisfies the criterion
{"match": false} - otherwise

Do not add any other keys, text, or formatting.<|im_end|>
<|im_start|>user
**Email Contents**
\`\`\`
${body}
\`\`\`
Classification Criteria: ${criterion}<|im_end|>
<|im_start|>assistant`;
}

class ClassificationTerm extends CustomerTermBase {
  constructor() { super("classification", [Ci.nsMsgSearchOp.Contains]); }

  match(msgHdr, value, op) {
    let key = msgHdr.messageId + "|" + value;
    if (this.cache.has(key)) return this.cache.get(key);
    let body = getPlainText(msgHdr);
    let payload = JSON.stringify({
      prompt: buildPrompt(body, value)
    });
    let xhr = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
    xhr.open("POST", gEndpoint, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    try { xhr.send(payload); } catch (e) { }
    let matched = false;
    if (xhr.status == 200) {
      try { matched = JSON.parse(xhr.responseText).match === true; } catch (e) {}
    }
    this.cache.set(key, matched);
    return matched;
  }
}

(function register() {
  let term = new ClassificationTerm();
  if (!MailServices.filters.getCustomTerm(term.id)) {
    MailServices.filters.addCustomTerm(term);
  }
})();

var AIFilter = {};

// allow other modules to access the term
AIFilter.ClassificationTerm = ClassificationTerm;
AIFilter.setConfig = setConfig;
