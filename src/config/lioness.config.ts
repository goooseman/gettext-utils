export default {
  funcArgumentsMap: {
    tc: ["msgid", undefined],
    tcn: ["msgid", "msgid_plural", undefined, undefined],
    tcp: ["msgctxt", "msgid", undefined],
    tcnp: ["msgctxt", "msgid", "msgid_plural", undefined, undefined],

    t: ["msgid", undefined, "msgctxt"],
    tn: ["msgid", "msgid_plural", undefined, undefined, "msgctxt"],
    tp: ["msgctxt", "msgid"],
    tnp: ["msgctxt", "msgid", "msgid_plural", undefined],

    tf: ["msgid", undefined, "msgctxt"],
    tnf: ["msgid", "msgid_plural", undefined, undefined, "msgctxt"],
  },
  componentPropsMap: {
    T: {
      message: "msgid",
      messagePlural: "msgid_plural",
      context: "msgctxt",
      comment: "comment",
    },
  },
};
