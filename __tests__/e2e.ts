import { exportStrings } from "@src/main";

describe("exportStrings function", () => {
  it("Should export correct strings from .tsx files", async () => {
    await exportStrings("__tests__/fixtures/react-project/src/**/{*.ts,*.tsx}");
    expect("false").toBe(true);
  });
});
