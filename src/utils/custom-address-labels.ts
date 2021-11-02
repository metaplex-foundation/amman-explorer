const ADDRESS_LABELS = "CustomAddressLabels";
// const ADDRESS_LABELS_PATH = "/tmp/solana-explorer-address-labels.json";

class CustomAddressLabels {
  private _labels: Map<string, string>;

  constructor(fileLabels?: Record<string, string>) {
    if (fileLabels != null) {
      this._labels = new Map(Object.entries(fileLabels));
    } else {
      const storedLabels: string | null = localStorage.getItem(ADDRESS_LABELS);
      if (storedLabels != null) {
        this._labels = this._parseAddressLabels(storedLabels).labels;
      } else {
        this._labels = new Map();
      }
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

let initializedAddressLabels = new CustomAddressLabels();

try {
  initializedAddressLabels = new CustomAddressLabels(
    require("../data/address-labels.json")
  );
} catch (_) {}

export const customAddressLabels = initializedAddressLabels;
