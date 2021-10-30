const ADDRESS_LABELS = "CustomAddressLabels";

class CustomAddressLabels {
  private _labels: Map<string, string>;

  constructor() {
    const storedLabels: string | null = localStorage.getItem(ADDRESS_LABELS);
    if (storedLabels != null) {
      this._labels = this._parseAddressLabels(storedLabels).labels;
    } else {
      this._labels = new Map();
    }
  }

  private _parseAddressLabels(labelsString: string) {
    try {
      const record: Record<string, string> = JSON.parse(labelsString);
      return { valid: true, labels: new Map(Object.entries(record)) };
    } catch (err) {
      console.error(`Invalid ${ADDRESS_LABELS}: ${labelsString}`);
      return { valid: false, labels: new Map() };
    }
  }

  update(labelsString: string) {
    const { valid, labels } = this._parseAddressLabels(labelsString);
    if (!valid) return;

    localStorage.setItem(ADDRESS_LABELS, labelsString);
    this._labels = labels;
  }

  get(address: string) {
    return this._labels.get(address);
  }
}

export const customAddressLabels = new CustomAddressLabels();
