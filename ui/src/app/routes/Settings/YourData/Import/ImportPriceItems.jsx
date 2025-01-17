import React, { useState } from 'react'
import { CSVLink } from 'react-csv';
import CSVReader from 'react-csv-reader'
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavCrump from '../../../../../components/NavCrump';
import axios from '../../../../../util/Api';
import { PriceItemsCSVLink } from '../PriceItemsData';

const headers = [
   { label: "Item ID", key: "_id" },
   { label: "Item code", key: "itemCode" },
   { label: "Item title", key: "productHeading" },
   { label: "Long description", key: "longDescription" },
   { label: "Cost price", key: "costPrice" },
   { label: "Unit price", key: "unitPrice" },
   { label: "Quantity", key: "quantity" },
   { label: "Discount", key: "discount" },
   { label: "Item total", key: "itemTotal" },
   { label: "Sales category", key: "salesCategory" },
   { label: "Tax rate", key: "taxRate" },
   { label: "Subscription", key: "subscription" },
   { label: "Editable quantity", key: "editableQuantity" },
   { label: "Optional", key: "optional" },
   { label: "Last changed", key: "updatedAt" }
];
const papaparseOptions = {
   header: true,
   dynamicTyping: false,
   skipEmptyLines: true,
   transformHeader: header => {
      switch (header) {
         case "Item ÏĐ": return "_id";
         case "Item ID": return "_id";
         case "Item code": return "itemCode";
         case "Item title": return "productHeading";
         case "Long description": return "longDescription";
         case "Cost price": return "costPrice";
         case "Unit price": return "unitPrice";
         case "Quantity": return "quantity";
         case "Discount": return "discount";
         case "Item total": return "itemTotal";
         case "Sales category": return "salesCategoryName";
         case "Tax rate": return "salesTaxName";
         case "Subscription": return "subscription";
         case "Editable quantity": return "editableQuantity";
         case "Optional": return "optional";
         case "Last changed": return "updatedAt";
         default: return header;
      }
   }
};
export default function ImportPriceItems() {
   const history = useHistory();
   const [isLoading, setLoading] = useState(false);
   const onFileLoaded = (dataArr, fileInfo) => {
      if (dataArr.length > 1000) {
         toast.success('A maximum of 1,000 contacts can be imported at a time.');
         return;
      }
      setLoading(true);
      console.log(" CSV DATA : ", dataArr)
      axios.post('/templates/priceitem/import/check', { csvArrData: dataArr }).then(({ data }) => {
         console.log(" CHECKED DATA RESPONSE : ", data);
         const {
            skipNum,
            createAvailableRows,
            updateAvailableRows,
            errorMessages,
         } = data;
         console.log(" skipNum : ", skipNum)
         console.log(" createAvailableRows : ", createAvailableRows)
         console.log(" updateAvailableRows : ", updateAvailableRows)
         console.log(" errorMessages : ", errorMessages)
         const createAvailableData = dataArr.filter((item, index) => {
            return createAvailableRows.includes(index);
         });
         const updateAvailableData = dataArr.filter((item, index) => {
            return updateAvailableRows.includes(index);
         });
         console.log(" createAvailableData: ", createAvailableData)
         console.log(" updateAvailableData: ", updateAvailableData)
         history.push({
            pathname: '/app/settings/your-data/import/price-items/confirm',
            state: {
               data: {
                  skipNum,
                  errorMessages,
                  createAvailableData: createAvailableData,
                  updateAvailableData: updateAvailableData,
               }
            }
         });
         // setLoading(false);
      }).catch(error => {
         setLoading(false);
      });
   }
   return (
      <React.Fragment>
         <NavCrump linkTo={`/app/settings/your-data`}>
            Import / Export
         </NavCrump>
         <div className="content">
            <h3 className="my-4">Import Price Items</h3>

            <div className="mb-4">
               <ol className="import-info-ul">
                  <li>
                     Download a CSV file.
                     <ul>
                        <li>Start from <CSVLink
                           data={[]}
                           headers={headers}
                           filename={"Example Price Items.csv"}
                           className="buttonLink"
                        >an empty template</CSVLink> or an
                           <PriceItemsCSVLink cssClassName="buttonLink" linkName="export of items" showIcon={false} /> (to make updates).
                        </li>
                     </ul>
                  </li>
                  <li>
                     Use a spreadsheet to update/copy items.
                     <ul>
                        <li>
                           Leave the first row of field names untouched, as this is needed to import.
                        </li>
                        <li>
                           To update items, use the ‘Item ID’ or ‘Item Code’. <a href="https://quotehard.com/help/import-export-price-items">Learn more…</a>
                        </li>
                        <li>
                           Items will NEVER be deleted.
                        </li>
                        <li>
                           A maximum of 1,000 items can be imported at a time.
                           <br />
                           (a limit of 5,000 items in total are supported in Quotient)
                        </li>
                     </ul>
                  </li>

                  <li>
                     Select your updated file and confirm…
                  </li>
               </ol>
            </div>

            <div className="mx-3">
               {/* use label to trigger manually input of CSVReader  */}
               <label htmlFor="react-csv-reader-input" className="btn btn-primary" disable={`${isLoading}`}>
                  {
                     isLoading ? <i className="fa fa-fw fa-circle-notch fa-spin mr-1" />
                        : <i className="fa fa-fw fa-paperclip mr-1" />
                  }
                  &nbsp;Choose CSV file
               </label>
               <CSVReader
                  cssClass="d-none"
                  onFileLoaded={onFileLoaded}
                  // onError={handleDarkSideForce}
                  disabled={isLoading}
                  parserOptions={papaparseOptions}
               />
            </div>
         </div>
      </React.Fragment>
   )
}
