export const assertBrowserFeature = ({
  apiName,
  check,
  reason,
}: {
  apiName: string;
  check: boolean;
  reason: string;
}) => {
  if (!check) {
    throw new Error(`[react-util] ${apiName} requires ${reason}.`);
  }
};
