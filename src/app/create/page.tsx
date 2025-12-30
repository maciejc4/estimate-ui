'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi, Work, RenovationTemplate, createWorkItemFromWork, downloadPdf, PdfEstimateRequest } from '@/lib/api';
import { useEstimateStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Plus, Trash2, FileText, Download } from 'lucide-react';

const STEPS = [
  'Dane podstawowe',
  'Wybor prac',
  'Ceny i ilosci',
  'Rabaty i uwagi',
  'Podsumowanie',
];

export default function CreateEstimatePage() {
  const [step, setStep] = useState(0);
  const store = useEstimateStore();

  const { data: works = [] } = useQuery({
    queryKey: ['catalog-works'],
    queryFn: () => catalogApi.getWorks().then(res => res.data),
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['catalog-templates'],
    queryFn: () => catalogApi.getTemplates().then(res => res.data),
  });

  const categories = [...new Set(works.map(w => w.category))];

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleAddWork = (work: Work) => {
    const workItem = createWorkItemFromWork(work);
    store.addWorkItem(workItem);
  };

  const handleAddTemplate = (template: RenovationTemplate) => {
    template.workIds.forEach(workId => {
      const work = works.find(w => w.id === workId);
      if (work) {
        handleAddWork(work);
      }
    });
  };

  const handleDownloadPdf = async (detail: 'FULL' | 'BASIC') => {
    const request: PdfEstimateRequest = {
      investorName: store.investorName,
      investorAddress: store.investorAddress,
      contractorName: store.contractorName || undefined,
      contractorAddress: store.contractorAddress || undefined,
      contractorPhone: store.contractorPhone || undefined,
      contractorEmail: store.contractorEmail || undefined,
      workItems: store.workItems,
      materialDiscount: store.materialDiscount,
      laborDiscount: store.laborDiscount,
      notes: store.notes || undefined,
      validUntil: store.validUntil || undefined,
      startDate: store.startDate || undefined,
    };
    await downloadPdf(request, detail);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Stworz Kosztorys</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className={`flex-1 text-center ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
              i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-200'
            }`}>
              {i + 1}
            </div>
            <span className="text-sm hidden md:block">{s}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 min-h-[400px]">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Dane Inwestora</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Nazwa inwestora *</label>
              <input
                type="text"
                value={store.investorName}
                onChange={(e) => store.setBasicInfo({ investorName: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="np. Jan Kowalski"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adres inwestycji *</label>
              <input
                type="text"
                value={store.investorAddress}
                onChange={(e) => store.setBasicInfo({ investorAddress: e.target.value })}
                className="w-full border rounded-lg p-2"
                placeholder="np. ul. Przykladowa 1, 00-001 Warszawa"
              />
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-4">Dane Wykonawcy (opcjonalnie)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nazwa wykonawcy</label>
                <input
                  type="text"
                  value={store.contractorName}
                  onChange={(e) => store.setBasicInfo({ contractorName: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefon</label>
                <input
                  type="tel"
                  value={store.contractorPhone}
                  onChange={(e) => store.setBasicInfo({ contractorPhone: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adres</label>
                <input
                  type="text"
                  value={store.contractorAddress}
                  onChange={(e) => store.setBasicInfo({ contractorAddress: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={store.contractorEmail}
                  onChange={(e) => store.setBasicInfo({ contractorEmail: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Wybierz prace do kosztorysu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Szablony remontow</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {templates.map(template => (
                    <div key={template.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{template.name}</span>
                        <span className="text-sm text-gray-500 block">{template.description}</span>
                      </div>
                      <button
                        onClick={() => handleAddTemplate(template)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Pojedyncze prace</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                  {categories.map(category => (
                    <div key={category} className="mb-2">
                      <div className="font-medium text-gray-600 text-sm mb-1">{category}</div>
                      {works.filter(w => w.category === category).map(work => (
                        <div key={work.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded ml-2">
                          <span>{work.name} ({work.unit})</span>
                          <button
                            onClick={() => handleAddWork(work)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Wybrane prace ({store.workItems.length})</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {store.workItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span>{item.workName}</span>
                    <button
                      onClick={() => store.removeWorkItem(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Podaj ilosci i ceny</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {store.workItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-medium">{item.workName}</span>
                      <span className="text-sm text-gray-500 ml-2">({item.unit})</span>
                    </div>
                    <button
                      onClick={() => store.removeWorkItem(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm mb-1">Ilosc ({item.unit})</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => store.updateWorkItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full border rounded p-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Cena robocizny (zl/{item.unit})</label>
                      <input
                        type="number"
                        value={item.laborPricePerUnit}
                        onChange={(e) => store.updateWorkItem(index, { laborPricePerUnit: parseFloat(e.target.value) || 0 })}
                        className="w-full border rounded p-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  {item.materialPrices.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Materialy:</label>
                      <div className="space-y-2">
                        {item.materialPrices.map((mat, matIndex) => (
                          <div key={matIndex} className="grid grid-cols-3 gap-2 text-sm">
                            <span className="self-center">{mat.materialName}</span>
                            <span className="self-center text-gray-500">
                              {mat.consumptionPerWorkUnit} {mat.unit}/{item.unit}
                            </span>
                            <input
                              type="number"
                              value={mat.pricePerUnit}
                              onChange={(e) => {
                                const newMaterialPrices = [...item.materialPrices];
                                newMaterialPrices[matIndex] = {
                                  ...mat,
                                  pricePerUnit: parseFloat(e.target.value) || 0
                                };
                                store.updateWorkItem(index, { materialPrices: newMaterialPrices });
                              }}
                              className="border rounded p-1"
                              min="0"
                              step="0.01"
                              placeholder="Cena/jm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Rabaty i dodatkowe informacje</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rabat na materialy (%)</label>
                <input
                  type="number"
                  value={store.materialDiscount}
                  onChange={(e) => store.setDiscounts(parseFloat(e.target.value) || 0, store.laborDiscount)}
                  className="w-full border rounded-lg p-2"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rabat na robocizne (%)</label>
                <input
                  type="number"
                  value={store.laborDiscount}
                  onChange={(e) => store.setDiscounts(store.materialDiscount, parseFloat(e.target.value) || 0)}
                  className="w-full border rounded-lg p-2"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Waznosc kosztorysu do</label>
                <input
                  type="date"
                  value={store.validUntil}
                  onChange={(e) => store.setDates(e.target.value, store.startDate)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Planowany termin rozpoczecia</label>
                <input
                  type="date"
                  value={store.startDate}
                  onChange={(e) => store.setDates(store.validUntil, e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Uwagi</label>
              <textarea
                value={store.notes}
                onChange={(e) => store.setNotes(e.target.value)}
                className="w-full border rounded-lg p-2 h-32"
                placeholder="Dodatkowe uwagi do kosztorysu..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Podsumowanie kosztorysu</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Inwestor</h3>
                <p className="text-gray-700">{store.investorName}</p>
                <p className="text-gray-500 text-sm">{store.investorAddress}</p>
              </div>
              {store.contractorName && (
                <div>
                  <h3 className="font-medium mb-2">Wykonawca</h3>
                  <p className="text-gray-700">{store.contractorName}</p>
                  <p className="text-gray-500 text-sm">{store.contractorPhone}</p>
                </div>
              )}
            </div>

            <h3 className="font-medium mt-6 mb-2">Pozycje kosztorysu ({store.workItems.length})</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Praca</th>
                    <th className="p-2 text-right">Ilosc</th>
                    <th className="p-2 text-right">Robocizna</th>
                    <th className="p-2 text-right">Materialy</th>
                  </tr>
                </thead>
                <tbody>
                  {store.workItems.map((item, i) => {
                    const laborCost = item.quantity * item.laborPricePerUnit;
                    const materialCost = item.materialPrices.reduce(
                      (sum, mat) => sum + mat.consumptionPerWorkUnit * mat.pricePerUnit * item.quantity, 0
                    );
                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2">{item.workName}</td>
                        <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                        <td className="p-2 text-right">{formatCurrency(laborCost)}</td>
                        <td className="p-2 text-right">{formatCurrency(materialCost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span>Robocizna:</span>
                <span>{formatCurrency(store.calculateLaborCost())}</span>
              </div>
              {store.laborDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Rabat na robocizne ({store.laborDiscount}%):</span>
                  <span>-{formatCurrency(store.calculateLaborCost() * store.laborDiscount / 100)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span>Materialy:</span>
                <span>{formatCurrency(store.calculateMaterialCost())}</span>
              </div>
              {store.materialDiscount > 0 && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Rabat na materialy ({store.materialDiscount}%):</span>
                  <span>-{formatCurrency(store.calculateMaterialCost() * store.materialDiscount / 100)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>RAZEM:</span>
                <span>{formatCurrency(store.calculateTotalCost())}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={() => handleDownloadPdf('FULL')}
                disabled={!store.investorName || !store.investorAddress || store.workItems.length === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                Pobierz PDF (pelny)
              </button>
              <button
                onClick={() => handleDownloadPdf('BASIC')}
                disabled={!store.investorName || !store.investorAddress || store.workItems.length === 0}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FileText size={20} />
                Pobierz PDF (skrocony)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          Wstecz
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={nextStep}
            disabled={step === 0 && (!store.investorName || !store.investorAddress)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Dalej
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => store.reset()}
            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
          >
            Nowy kosztorys
          </button>
        )}
      </div>
    </div>
  );
}
