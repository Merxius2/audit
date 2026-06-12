import {
  generateExportString,
  parseImportString,
  __testing,
} from '../../lib/importExport';

const {
  buildExportPayload,
  compressDashboard,
  decompressDashboardV2,
  compressObjectLegacy,
  parsePayload,
} = __testing;

const sampleDashboard = {
  calculationType: 'separate',
  person1Incomes: [{ id: '1', label: 'Salary', amount: '3000' }],
  person2Incomes: [{ id: '2', label: 'Salary', amount: '2500' }],
  person1Savings: '200',
  person2Savings: '150',
  person1Expenses: { Insurance: '50', Phone: '30', Car: '' },
  person2Expenses: { Insurance: '40' },
  sharedExpenses: { Utilities: '120', House: '800' },
  person1Name: 'Alice',
  person2Name: 'Bob',
  includeSavingsInCalculations: true,
  person1SavingsPots: [
    { id: 'p1', name: 'Vacation', goalAmount: '5000', currentAmount: '1000', monthlyContribution: '100' },
  ],
  person2SavingsPots: [
    { id: 'p2', name: 'Car', goalAmount: '10000', currentAmount: '2000', monthlyContribution: '75' },
  ],
  expenseLineItems: {
    shared: { Insurance: [{ id: 'i1', name: 'Health', amount: '80' }] },
    person1: { Phone: [{ id: 'ph1', name: 'Mobile', amount: '25' }] },
    person2: { Insurance: [{ id: 'i2', name: 'Dental', amount: '15' }] },
    separateShared: { Utilities: [{ id: 'u1', name: 'Electric', amount: '90' }] },
  },
};

const sampleRetirement = {
  calculationType: 'forward',
  currentAge: '35',
  retirementAge: '67',
  monthlyInvestment: '500',
  annualReturn: '7',
  goalBalance: '1000000',
  currentBalance: '50000',
};

const crc32 = (str) => {
  const table = (() => {
    const tbl = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      tbl[n] = c;
    }
    return tbl;
  })();
  let crc = 0 ^ -1;
  for (let i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
};

describe('importExport', () => {
  it('round-trips v2 dashboard and retirement data', async () => {
    const exported = await generateExportString(sampleDashboard, sampleRetirement);
    const { dashboardData, retirementData } = await parseImportString(exported);

    expect(dashboardData).toEqual(sampleDashboard);
    expect(retirementData).toEqual(sampleRetirement);
  });

  it('imports legacy v1 exports', async () => {
    const legacyPayload = {
      d: compressObjectLegacy(sampleDashboard),
      r: compressObjectLegacy(sampleRetirement),
    };
    const encoded = Buffer.from(JSON.stringify(legacyPayload), 'utf8').toString('base64');
    const legacyString = `${encoded}:${crc32(encoded)}`;
    const { dashboardData, retirementData } = await parseImportString(legacyString);

    expect(dashboardData).toEqual(sampleDashboard);
    expect(retirementData).toEqual(sampleRetirement);
  });

  it('omits default includeSavingsInCalculations on export', () => {
    const payload = buildExportPayload({ ...sampleDashboard, includeSavingsInCalculations: true }, {});
    expect(payload.d.isc).toBeUndefined();

    const falsePayload = buildExportPayload({ ...sampleDashboard, includeSavingsInCalculations: false }, {});
    expect(falsePayload.d.isc).toBe(0);

    const restored = decompressDashboardV2(falsePayload.d);
    expect(restored.includeSavingsInCalculations).toBe(false);
  });

  it('compresses nested structures', () => {
    const compressed = compressDashboard(sampleDashboard);

    expect(compressed.ct).toBe('separate');
    expect(compressed.p1i).toEqual([['1', 'Salary', '3000']]);
    expect(compressed.p1e).toEqual({ 8: '50', 7: '30' });
    expect(compressed.eli.s[8]).toEqual([['i1', 'Health', '80']]);
    expect(compressed.p1p).toEqual([['p1', 'Vacation', '5000', '1000', '100']]);
  });

  it('produces shorter exports than legacy encoding', async () => {
    const legacyJson = JSON.stringify({
      d: compressObjectLegacy(sampleDashboard),
      r: compressObjectLegacy(sampleRetirement),
    });
    const v2Json = JSON.stringify(buildExportPayload(sampleDashboard, sampleRetirement));

    expect(v2Json.length).toBeLessThan(legacyJson.length);

    const exported = await generateExportString(sampleDashboard, sampleRetirement);
    const legacyEncoded = Buffer.from(legacyJson, 'utf8').toString('base64');
    expect(exported.split(':')[0].length).toBeLessThan(legacyEncoded.length);
  });

  it('rejects tampered checksums', async () => {
    const exported = await generateExportString(sampleDashboard, sampleRetirement);
    const tampered = `${exported.slice(0, -3)}000:${exported.split(':')[1]}`;
    await expect(parseImportString(tampered)).rejects.toThrow(/Checksum validation failed/);
  });

  it('preserves legacy savingsPots key through v2 round-trip', async () => {
    const legacy = {
      calculationType: 'shared',
      savingsPots: [{ id: 'old', name: 'Legacy pot', monthlyContribution: '50' }],
      expenses: { Insurance: '75' },
    };

    const exported = await generateExportString(legacy, {});
    const { dashboardData } = await parseImportString(exported);
    expect(dashboardData.savingsPots).toEqual(legacy.savingsPots);
  });

  it('parses legacy payload objects directly', () => {
    const legacy = parsePayload({
      d: compressObjectLegacy(sampleDashboard),
      r: compressObjectLegacy(sampleRetirement),
    });
    expect(legacy.dashboardData).toEqual(sampleDashboard);
  });
});
