# sinarmas-mobile



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/bluesoft3/sinarmas-mobile.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/bluesoft3/sinarmas-mobile/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

## Name
Sinarmas Mobile Apps

## Description
Project mobile apps untuk frontend dari aplikasi HRGA BIB Digitalization

## Badges
-

## Visuals
-

## Installation or Development
Proyek ini menggunakan framework Ionic. Pastikan Anda sudah memili software-software berikut terinstall di komputer:
- Ionic CLI v6.20.1
- Ionic Framework @ionic/react 6.2.4
- Capacitor v4.1.0
- TailwindUi v3.1.8
- NodeJS >= v14.17.3
- npm >= v6.14.3

Android:
- Android Studio
- SDK >= API Level 22
- JDK v17

IOS:

### Pre-run
Untuk pertama kali, silahkan eksekusi syntax berikut:
```
npm install
```

### Run
Eksekusi syntax berikut:
```
ionic serve
```

### Build
Eksekusi syntax berikut:
```
ionic build
ionic cap add ios
ionic cap add android
```
Setiap kali build pastikan untuk eksekusi syntax berikut:
```
ionic cap copy
ionic cap sync
```

Tambahan untuk Android:
```
ionic cap open android
```

Jika ingin deploy langsung ke device android, berikut langkah-langkahnya
- Tambahkan path adb ke system (hanya jika ```adb``` tidak dikenali)
C:\Users\USERNAME\AppData\Local\Android\sdk\platform-tools.
- Pastikan device sudah terhubung dengan menggunakan kabel data
- Cek terlebih dahulu id device dengan syntax berikut:
```adb device``` lalu copy
- Eksekusi syntax berikut untuk deploy dan run: 
```ionic capacitor run android --target [device-id]``` ganti device-id dengan yang tadi (tanpa kurung siku)

## Usage
-

## Support
-

## Roadmap
-

## Contributing
-

## Authors and acknowledgment
-

## License
Copyright 2022 - Bluesoft Team. PT Bening Guru Semesta

## Project status
Development