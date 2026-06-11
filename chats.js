// chats.js — Только новый Intercom чат
if (!window.helpdeskUser) {
    console.error('helpdeskUser not initialized!');
} else {
    window.intercomSettings = {
        api_base: "https://api-iam.intercom.io",
        app_id: "e7s8lh5w",
        user_id: window.helpdeskUser.id,
        name: window.helpdeskUser.name,
        email: window.helpdeskUser.email,
        created_at: window.helpdeskUser.createdAt,
    };
}

(function() {
    var w = window;
    var ic = w.Intercom;
    
    if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
    } else {
        var d = document;
        var i = function() { i.c(arguments); };
        i.q = [];
        i.c = function(args) { i.q.push(args); };
        w.Intercom = i;
        var l = function() {
            var s = d.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = 'https://widget.intercom.io/widget/e7s8lh5w';
            var x = d.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === 'complete') {
            l();
        } else if (w.attachEvent) {
            w.attachEvent('onload', l);
        } else {
            w.addEventListener('load', l, false);
        }
    }
})();
