export class PremiumRequiredError extends Error {
  constructor(methodName: string) {
    super(`Method '${methodName}' requires premium membership`);
    this.name = "PremiumRequiredError";
  }
}

export function RequirePremium() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: any, ...args: any[]) {
      if (typeof this.getIsPremium !== "function") {
        throw new Error(
          `@RequirePremium can only be used on classes with getIsPremium() method`
        );
      }

      if (!this.getIsPremium()) {
        throw new PremiumRequiredError(propertyKey); 
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
