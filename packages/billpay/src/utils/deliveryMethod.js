const DELIVERY_METHODS = {
  DIRECT_CHECK: {
    name: "Check by Mail",
    shortName: "Check by Mail",
    icon: "mail",
  },
  STANDARD_ELECTRONIC: {
    name: "Electronic Payment",
    shortName: "Electronic",
    icon: "electronic",
  },
  TRUST_CHECK: {
    name: "Check by Mail",
    shortName: "Check by Mail",
    icon: "mail",
  },
};

export const getDeliveryMethod = (deliveryMethodKey) => {
  const defaultDeliveryMethodData = {
    name: deliveryMethodKey,
    shortName: deliveryMethodKey,
    icon: undefined,
  };
  const deliveryMethod = DELIVERY_METHODS[deliveryMethodKey] || {};
  return { ...defaultDeliveryMethodData, ...deliveryMethod };
};
