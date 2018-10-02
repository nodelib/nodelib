import { NSMeter } from '@nodelib/benchmark.meter';

export function makeMeterLine(label: string, value: number, type: NSMeter.Type = NSMeter.Type.Common): string {
	return [NSMeter.Symbols.Prefix, label, type, value].join(NSMeter.Symbols.Separator);
}
