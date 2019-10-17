export const optimizeMessageForGit = <
  T extends ExtractedMessage | TranslationMessage
>(
  message: T,
): T => {
  if (!message.comments) {
    return message;
  }

  const { reference } = message.comments;
  const newReference =
    typeof reference === "string"
      ? // Remove column number from TranslationMessage
        reference.replace(/:\d*$/gm, ":")
      : // Remove line and column from ExtractedMessage
        reference.map((ref) => {
          return {
            ...ref,
            line: "",
            column: "",
          };
        });

  return {
    ...message,
    comments: {
      ...message.comments,
      reference: newReference,
    },
  };
};

export const optimizeContextForGit = (
  context: TranslationContext,
): TranslationContext => {
  return Object.entries(context).reduce(
    (res: TranslationContext, [msgid, message]) => {
      res[msgid] = optimizeMessageForGit(message);
      return res;
    },
    {},
  );
};

export const optimizePotForGit = (pot: Translation): Translation => {
  const translations = Object.entries(pot.translations).reduce(
    (res: Translation["translations"], [contextId, context]) => {
      res[contextId] = optimizeContextForGit(context);
      return res;
    },
    {},
  );

  return {
    ...pot,
    translations,
  };
};
