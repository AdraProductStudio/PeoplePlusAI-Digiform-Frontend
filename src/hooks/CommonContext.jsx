import { createContext, useState } from "react";
import Cookies from 'js-cookie';


const CommonContext = createContext();

export const    DataProvider = ({ children }) => {

    const [extractedJSONFields, setExtractedJSONFields] = useState([
        {
            "type": "PDFTextField",
            "name": "name",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "FatherName",
            "value": "",
        },
        {
            "type": "PDFRadioGroup",
            "name": "Gender",
            "value": "",
        },
        {
            "type": "PDFRadioGroup",
            "name": "MaritalStatus",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Dob",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Nationality",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Pan",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Aadhar",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ProofOfIdentity",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ResidenceAddress",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ResidentCity",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ResidentPincode",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ResidentState",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ResidentCountry",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "TelOffice",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "TelResidence",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "phone",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Fax",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "Email",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "ProofOfAddress",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "NonResident",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "PermanentCity",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "PermanentPinCode",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "PermanentState",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "PermanentCountry",
            "value": "",
        },
        {
            "type": "PDFSignature",
            "name": "DeclarationSign",
            "value": "Unsupported field type"
        },
        {
            "type": "PDFTextField",
            "name": "DeclarationDate",
            "value": "",
        },
        {
            "type": "PDFCheckBox",
            "name": "OfficeUseCheckBox",
            "value": false
        },
        {
            "type": "PDFSignature",
            "name": "OfficeUseSign",
            "value": "Unsupported field type"
        },
        {
            "type": "PDFTextField",
            "name": "OfficeUseDate",
            "value": "",
        },
        {
            "type": "PDFRadioGroup",
            "name": "Status",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "BusinessApplicant",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "DOI",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "PlaceOfInCorporation",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "DateCommencement",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "BusinessPan",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegistrationNum",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "BusinessStatusSpecify",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresAddress",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresCity",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresPincode",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresState",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresCountry",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresTelOffice",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresTelRes",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresMobile",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresFax",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "CorresEmail",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "BusinessProofAddress",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegisteredAddress",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegisteredCity",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegisteredPincode",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegisteredState",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "RegisteredCountry",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "NamePanAddressPhoto",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "DIN",
            "value": "",
        },
        {
            "type": "PDFTextField",
            "name": "AdharNumPromoter",
            "value": "",
        },
        {
            "type": "PDFSignature",
            "name": "BusinessDecSign",
            "value": "Unsupported field type"
        },
        {
            "type": "PDFTextField",
            "name": "BusinessDecDate",
            "value": "",
        },
        {
            "type": "PDFCheckBox",
            "name": "BusinessOfficeCheckBox",
            "value": false
        },
        {
            "type": "PDFSignature",
            "name": "BusinessOfficeSign",
            "value": "Unsupported field type"
        },
        {
            "type": "PDFTextField",
            "name": "BusinessOfficeDate",
            "value": "",
        },
        {
            "type": "PDFRadioGroup",
            "name": "BusinessStatus",
            "value": "",
        }
    ])


    // Crop Image States

    const [uploadFileType, setUploadFileType] = useState(false)


    const [pdfFilePath, setPdfFilePath] = useState(Cookies.get("selectedPdf"))
    const [outputPdf, setOutputPdf] = useState(null);

    const [fetchedPdfBlobFile, setFetchedPdfBlobFile] = useState("")

    return (
        <CommonContext.Provider value={{
            extractedJSONFields,
            setExtractedJSONFields,
            pdfFilePath,
            setPdfFilePath,
            outputPdf,
            setOutputPdf,
            fetchedPdfBlobFile,
            setFetchedPdfBlobFile

        }}>
            {children}
        </CommonContext.Provider>
    )
}


export default CommonContext;