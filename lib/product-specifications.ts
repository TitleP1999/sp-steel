import type { Product } from "../data/products";
import { tisconStirrupRows } from "./tiscon-superlinks";

export type ProductSpecification = { size: string; thickness: string; weight: string; basis: string; unitWeight: number | null; saleWeight: number | null; saleUnit: string };

const fixedWeights: Record<string, number[]> = {
  "c-channel": [1.63, 2.86, 4.06, 8.01],
  "h-beam": [17.2, 23.8, 31.5, 49.9],
  "i-beam": [17.1, 26, 50.4, 38.3],
  "wide-flange": [9.3, 14, 21.1, 21.3],
  "sheet-pile": [48, 58.4, 60, 76.1]
};

const parseNumber = (value: string) => Number(value.replace(",", "."));
const format = (value: number) => value.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dimensions = (size: string) => Array.from(size.matchAll(/\d+(?:[.,]\d+)?/g), match => parseNumber(match[0]));

function displaySize(slug: string, size: string) {
  const plateSize = size.match(/(\d+(?:\.\d+)?)\s*(?:×|x)\s*(\d+(?:\.\d+)?)\s*ฟุต/);
  if (plateSize) {
    const width = parseNumber(plateSize[1]);
    const length = parseNumber(plateSize[2]);
    return `${width} ฟุต x ${length} ฟุต (ประมาณ ${format(width * 0.3048)} เมตร x ${format(length * 0.3048)} เมตร)`;
  }
  if (["round-bar", "deformed-bar"].includes(slug)) return "ความยาวมาตรฐาน 10 เมตร";
  if (slug === "wire-mesh") return "แผ่นมาตรฐาน 2 เมตร x 5 เมตร";
  return "ความยาวมาตรฐาน 6 เมตร";
}

function theoreticalWeight(slug: string, size: string): { value: number; unit: string } | null {
  const values = dimensions(size);
  const thicknessMatch = size.match(/หนา\s*(\d+(?:[.,]\d+)?)/);
  const thickness = thicknessMatch ? parseNumber(thicknessMatch[1]) : values.at(-1);
  if (!thickness) return null;
  if (["square-tube", "square-tube-jis", "galvanized-square-tube"].includes(slug)) {
    const side = values[0]; return { value: (side * side - (side - 2 * thickness) ** 2) * 0.00785, unit: "กก./ม." };
  }
  if (["rectangular-tube", "rectangular-tube-jis", "galvanized-rectangular-tube"].includes(slug)) {
    const [width, height] = values; return { value: (width * height - (width - 2 * thickness) * (height - 2 * thickness)) * 0.00785, unit: "กก./ม." };
  }
  if (["black-pipe", "black-pipe-jis"].includes(slug)) {
    const diameter = values[0]; return { value: Math.PI / 4 * (diameter ** 2 - (diameter - 2 * thickness) ** 2) * 0.00785, unit: "กก./ม." };
  }
  if (slug === "galvanized-c-channel") {
    const [height, width, lip] = values; return { value: (height + 2 * width + 2 * lip - 8 * thickness) * thickness * 0.00785, unit: "กก./ม." };
  }
  if (slug === "angle-bar") {
    const side = values[0]; return { value: (2 * side - thickness) * thickness * 0.00785, unit: "กก./ม." };
  }
  if (slug === "channel-bar") {
    const [height, width, web, flange] = values; return { value: ((height - 2 * flange) * web + 2 * width * flange) * 0.00785, unit: "กก./ม." };
  }
  if (["black-steel-plate", "cold-rolled-sheet", "checkered-plate", "galvanized-sheet"].includes(slug)) {
    const feet = Array.from(size.matchAll(/(\d+(?:\.\d+)?)\s*(?:×|x)\s*(\d+(?:\.\d+)?)\s*ฟุต/g))[0];
    if (!feet) return null;
    return { value: parseNumber(feet[1]) * 0.3048 * parseNumber(feet[2]) * 0.3048 * thickness * 7.85, unit: "กก./แผ่น" };
  }
  if (["round-bar", "deformed-bar"].includes(slug)) {
    const diameter = values[0]; return { value: diameter ** 2 / 162, unit: "กก./ม." };
  }
  if (slug === "wire-mesh") {
    const [diameter, spacingCm] = values; return { value: 2 * (diameter ** 2 / 162) * (100 / spacingCm), unit: "กก./ตร.ม." };
  }
  return null;
}

export function getProductSpecifications(product: Product): ProductSpecification[] {
  return product.options.map((option, index) => {
    if (product.slug === "tiscon-superlinks") {
      const row = tisconStirrupRows.find(item => item.size === option.size);
      return { size: option.size, thickness: "6 มม.", weight: row ? `${format(row.pieceWeight)} กก./ชิ้น` : "โปรดตรวจสอบกับฝ่ายขาย", basis: row ? `${row.bagWeight} กก./กระสอบ · ${row.piecesPerBag} ชิ้น` : "บรรจุกระสอบ", unitWeight: row?.pieceWeight ?? null, saleWeight: row?.bagWeight ?? null, saleUnit: "กระสอบ" };
    }
    const thickness = option.size.match(/หนา\s*(\d+(?:[.,]\d+)?)\s*มม\./)?.[1];
    const fixed = fixedWeights[product.slug]?.[index];
    const calculated = fixed === undefined ? theoreticalWeight(product.slug, option.size) : null;
    const unitWeight = fixed ?? calculated?.value ?? null;
    const unit = fixed !== undefined ? "กก./ม." : calculated?.unit ?? "";
    const weight = unitWeight !== null ? `${format(unitWeight)} ${unit}` : "โปรดตรวจสอบกับฝ่ายขาย";
    const isPlate = unit === "กก./แผ่น";
    const isBar = ["round-bar", "deformed-bar"].includes(product.slug);
    const saleWeight = unitWeight === null ? null : isPlate ? unitWeight : unit === "กก./ม." ? unitWeight * (isBar ? 10 : 6) : null;
    const saleUnit = isPlate ? "แผ่น" : product.slug === "wire-mesh" ? "แผ่น" : "เส้น";
    return { size: option.size, thickness: thickness ? `${thickness} มม.` : "ระบุในขนาด", weight, basis: displaySize(product.slug, option.size), unitWeight, saleWeight, saleUnit };
  });
}
