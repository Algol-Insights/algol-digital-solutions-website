'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ImportedProduct {
  name: string;
  brand: string;
  category: string;
  price: number;
  specs?: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER';
  variants?: Array<{ name: string; price: number }>;
}

export default function ProductImportPage() {
  const [textInput, setTextInput] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ImportedProduct[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  const parseTextInput = () => {
    try {
      const products = parseProductList(textInput);
      setParsedProducts(products);
      validateProducts(products);
    } catch (error) {
      alert('Failed to parse product list. Please check the format.');
      console.error(error);
    }
  };

  const validateProducts = async (products: ImportedProduct[]) => {
    try {
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, mode: 'preview' }),
      });

      const data = await response.json();
      setValidationResults(data);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleImport = async () => {
    if (!validationResults || validationResults.summary.valid === 0) {
      alert('No valid products to import');
      return;
    }

    if (!confirm(`Import ${validationResults.summary.valid} products?`)) {
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          products: validationResults.products, 
          mode: 'import' 
        }),
      });

      const data = await response.json();
      setImportResults(data);
      
      if (data.success) {
        alert(`Successfully imported ${data.summary.successful} products!`);
        setTextInput('');
        setParsedProducts([]);
        setValidationResults(null);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import products');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Import</h1>
        <p className="text-muted-foreground">
          Paste your product list below. AI will parse and validate before import.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <label className="block mb-2 font-medium">
          <FileText className="inline mr-2 h-5 w-5" />
          Product List
        </label>
        <textarea
          className="w-full h-96 p-4 border border-border rounded-lg font-mono text-sm bg-background"
          placeholder="Paste your product list here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <div className="mt-4 flex gap-3">
          <button
            onClick={parseTextInput}
            disabled={!textInput.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            Parse & Validate
          </button>
          <button
            onClick={() => {
              setTextInput('');
              setParsedProducts([]);
              setValidationResults(null);
              setImportResults(null);
            }}
            className="px-6 py-2 border border-border rounded-lg hover:bg-accent"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Validation Results</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-3xl font-bold">{validationResults.summary.total}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Valid</p>
              <p className="text-3xl font-bold text-green-600">{validationResults.summary.valid}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Invalid</p>
              <p className="text-3xl font-bold text-red-600">{validationResults.summary.invalid}</p>
            </div>
          </div>

          {validationResults.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-red-600">
                <XCircle className="inline mr-2 h-5 w-5" />
                Errors
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validationResults.errors.map((error: any, idx: number) => (
                  <div key={idx} className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200">
                    <p className="font-medium">{error.product.name}</p>
                    <p className="text-sm text-red-600">{error.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={importing || validationResults.summary.valid === 0}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {importing ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="inline mr-2 h-5 w-5" />
                Import {validationResults.summary.valid} Products
              </>
            )}
          </button>
        </div>
      )}

      {/* Import Results */}
      {importResults && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            <CheckCircle className="inline mr-2 h-6 w-6 text-green-600" />
            Import Complete
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-3xl font-bold text-green-600">{importResults.summary.successful}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-3xl font-bold text-red-600">{importResults.summary.failed}</p>
            </div>
          </div>

          {importResults.imported.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold mb-2 text-green-600">Successfully Imported</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {importResults.imported.map((item: any, idx: number) => (
                  <div key={idx} className="text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                    ✓ {item.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {importResults.failed.length > 0 && (
            <div>
              <h3 className="font-bold mb-2 text-red-600">Failed Imports</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {importResults.failed.map((item: any, idx: number) => (
                  <div key={idx} className="bg-red-50 dark:bg-red-950 p-3 rounded">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-red-600">{item.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function parseProductList(text: string): ImportedProduct[] {
  const products: ImportedProduct[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentCategory = '';
  let currentBrand = '';

  for (const line of lines) {
    // Detect category headers
    if (line.startsWith('## *') && line.endsWith('*')) {
      const category = line.replace(/##\s*\*/, '').replace(/\*/, '').trim();
      currentCategory = category;
      currentBrand = category.split(' ')[0]; // First word is usually brand
      continue;
    }

    // Skip non-product lines
    if (line.startsWith('#') || line.includes('Free Delivery') || 
        line.includes('Instock') || line.includes('Out of stock') ||
        line.includes('Preorder') || !line.match(/\d/)) {
      continue;
    }

    // Parse product line
    const match = line.match(/^\d+\.\s*(.+?)\s*–\s*\$(\d+)\s*(⚪|🔵|⚫️)?/);
    if (match) {
      const [, nameAndSpecs, priceStr, stockEmoji] = match;
      
      let stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PREORDER' = 'IN_STOCK';
      if (stockEmoji === '🔵') stockStatus = 'OUT_OF_STOCK';
      if (stockEmoji === '⚫️') stockStatus = 'PREORDER';

      products.push({
        name: nameAndSpecs.trim(),
        brand: currentBrand,
        category: currentCategory,
        price: parseInt(priceStr),
        specs: nameAndSpecs.trim(),
        stockStatus,
      });
    }

    // Check for variant lines (starting with •)
    const variantMatch = line.match(/^\s*•\s*(.+?)\s*–\s*\$(\d+)\s*(⚪|🔵|⚫️)?/);
    if (variantMatch && products.length > 0) {
      const [, variantName, variantPrice, stockEmoji] = variantMatch;
      const lastProduct = products[products.length - 1];
      
      if (!lastProduct.variants) {
        lastProduct.variants = [];
      }
      
      lastProduct.variants.push({
        name: variantName.trim(),
        price: parseInt(variantPrice),
      });
    }
  }

  return products;
}
