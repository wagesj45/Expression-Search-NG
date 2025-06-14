var { ExtensionCommon } = ChromeUtils.importESModule("resource://gre/modules/ExtensionCommon.sys.mjs");
var { Services } = globalThis || ChromeUtils.importESModule("resource://gre/modules/Services.sys.mjs");
var { MailServices } = ChromeUtils.importESModule("resource:///modules/MailServices.sys.mjs");

console.log("[ai-filter][api] Experiment API module loaded");

var resProto = Cc["@mozilla.org/network/protocol;1?name=resource"]
    .getService(Ci.nsISubstitutingProtocolHandler);

function registerResourceUrl(extension, namespace) {
    console.log(`[ai-filter][api] registerResourceUrl called for namespace="${namespace}"`);
    if (resProto.hasSubstitution(namespace)) {
        console.log(`[ai-filter][api] namespace="${namespace}" already registered, skipping`);
        return;
    }
    let uri = Services.io.newURI(".", null, extension.rootURI);
    console.log(`[ai-filter][api] setting substitution for "${namespace}" → ${uri.spec}`);
    resProto.setSubstitutionWithFlags(namespace, uri, resProto.ALLOW_CONTENT_ACCESS);
}

var gTerm;
var gEndpoint;
var gSystemPrompt;

var aiFilter = class extends ExtensionCommon.ExtensionAPI {
    async onStartup() {
        console.log("[ai-filter][api] onStartup()");
        let { extension } = this;

        registerResourceUrl(extension, "aifilter");

        try {
            let store = await extension.storage.local.get(["endpoint", "system"]);
            console.log("[ai-filter][api] storage loaded:", store);
            if (store.endpoint) {
                gEndpoint = store.endpoint;
                console.log("[ai-filter][api] endpoint set to", gEndpoint);
            }
            if (store.system) {
                gSystemPrompt = store.system;
                console.log("[ai-filter][api] system prompt set to", gSystemPrompt);
            }
        }
        catch (err) {
            console.error("[ai-filter][api] error reading storage:", err);
        }

        try {
            console.log("[ai-filter][api] importing ExpressionSearchFilter.jsm");
            ChromeUtils.import("resource://aifilter/modules/ExpressionSearchFilter.jsm");
            console.log("[ai-filter][api] ExpressionSearchFilter.jsm import succeeded");
        }
        catch (err) {
            console.error("[ai-filter][api] failed to import ExpressionSearchFilter.jsm:", err);
        }
    }

    onShutdown(isAppShutdown) {
        console.log("[ai-filter][api] onShutdown(), isAppShutdown =", isAppShutdown);
        if (!isAppShutdown && resProto.hasSubstitution("aifilter")) {
            console.log("[ai-filter][api] removing substitution for namespace='aifilter'");
            resProto.setSubstitution("aifilter", null);
        }
    }

    getAPI(context) {
        console.log("[ai-filter][api] getAPI()");
        return {
            aiFilter: {
                classify: async (msg) => {
                    console.log("[ai-filter][api] classify() called with msg:", msg);
                    try {
                        if (!gTerm) {
                            console.log("[ai-filter][api] instantiating new ClassificationTerm");
                            let mod = ChromeUtils.import("resource://aifilter/modules/ExpressionSearchFilter.jsm");
                            gTerm = new mod.ClassificationTerm();
                        }
                        console.log("[ai-filter][api] calling gTerm.match()");
                        let matchResult = gTerm.match(
                            msg.msgHdr,
                            msg.value,
                            Ci.nsMsgSearchOp.Contains
                        );
                        console.log("[ai-filter][api] gTerm.match() returned:", matchResult);
                        return matchResult;
                    }
                    catch (err) {
                        console.error("[ai-filter][api] error in classify():", err);
                        throw err;
                    }
                }
            }
        };
    }
};
