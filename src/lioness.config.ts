export default {
  funcArgumentsMap: {
    tc: ["msgid", undefined],
    tcn: ["msgid", "msgid_plural", undefined, undefined],
    tcp: ["msgctxt", "msgid", undefined],
    tcnp: ["msgctxt", "msgid", "msgid_plural", undefined, undefined],

    t: ["msgid"],
    tn: ["msgid", "msgid_plural", undefined],
    tp: ["msgctxt", "msgid"],
    tnp: ["msgctxt", "msgid", "msgid_plural", undefined],
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
