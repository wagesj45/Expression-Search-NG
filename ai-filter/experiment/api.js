var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var { MailServices } = ChromeUtils.import("resource:///modules/MailServices.jsm");

var resProto = Cc["@mozilla.org/network/protocol;1?name=resource"].getService(Ci.nsISubstitutingProtocolHandler);

function registerResourceUrl(extension, namespace) {
  if (resProto.hasSubstitution(namespace)) return;
  let uri = Services.io.newURI(".", null, extension.rootURI);
  resProto.setSubstitutionWithFlags(namespace, uri, resProto.ALLOW_CONTENT_ACCESS);
}

var gTerm;

var aiFilter = class extends ExtensionCommon.ExtensionAPI {
  async onStartup() {
    let { extension } = this;
    registerResourceUrl(extension, "aifilter");
    await extension.storage.local.get(["endpoint", "system"]).then(store => {
      if (store.endpoint) gEndpoint = store.endpoint;
      if (store.system) gSystemPrompt = store.system;
    });
    ChromeUtils.import("resource://aifilter/modules/ExpressionSearchFilter.jsm");
  }

  onShutdown(isAppShutdown) {
    if (!isAppShutdown && resProto.hasSubstitution("aifilter")) {
      resProto.setSubstitution("aifilter", null);
    }
  }

  getAPI(context) {
    return {
      aiFilter: {
        classify: async (msg) => {
          if (!gTerm) {
            let mod = ChromeUtils.import("resource://aifilter/modules/ExpressionSearchFilter.jsm");
            gTerm = new mod.ClassificationTerm();
          }
          return gTerm.match(msg.msgHdr, msg.value, Ci.nsMsgSearchOp.Contains);
        }
      }
    };
  }
};
