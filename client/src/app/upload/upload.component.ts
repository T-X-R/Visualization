import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { SpData } from '../models/spdata';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver?: boolean;
  uploadData!: SpData[];
  baseUrl = environment.apiUrl;

  constructor(public fileService: FileService, private toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'csv/upload-csv',
      isHTML5: true,
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.uploadData = JSON.parse(response);
        this.fileService.setCurrentFile(this.uploadData);
        this.toastr.success("File Uploaded Successfully")
      }
    }
  }

}
