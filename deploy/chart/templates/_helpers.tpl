{{/*
Expand the name of the chart.
*/}}
{{- define "traditional-saju.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "traditional-saju.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "traditional-saju.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "traditional-saju.labels" -}}
helm.sh/chart: {{ include "traditional-saju.chart" . }}
{{ include "traditional-saju.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "traditional-saju.selectorLabels" -}}
app.kubernetes.io/name: {{ include "traditional-saju.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "traditional-saju.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "traditional-saju.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Database Secret name
*/}}
{{- define "traditional-saju.databaseSecretName" -}}
{{- if .Values.database.existingSecret }}
{{- .Values.database.existingSecret }}
{{- else }}
{{- printf "%s-database" (include "traditional-saju.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Redis Secret Name
*/}}
{{- define "traditional-saju.redisSecretName" -}}
{{- if .Values.redis.existingSecret }}
{{- .Values.redis.existingSecret }}
{{- else }}
{{- printf "%s-redis" (include "traditional-saju.fullname" .) }}
{{- end }}
{{- end }}

{{/*
JWT Secret Name
*/}}
{{- define "traditional-saju.jwtSecretName" -}}
{{- if .Values.jwt.existingSecret }}
{{- .Values.jwt.existingSecret }}
{{- else }}
{{- printf "%s-jwt" (include "traditional-saju.fullname" .) }}
{{- end }}
{{- end }}

{{/*
IDP Secret Name
*/}}
{{- define "traditional-saju.idpSecretName" -}}
{{- if .Values.idp.existingSecret }}
{{- .Values.idp.existingSecret }}
{{- else }}
{{- printf "%s-idp" (include "traditional-saju.fullname" .) }}
{{- end }}
{{- end }}

{{/*
OpenAI Secret Name
*/}}
{{- define "traditional-saju.openaiSecretName" -}}
{{- if .Values.openai.existingSecret }}
{{- .Values.openai.existingSecret }}
{{- else }}
{{- printf "%s-openai" (include "traditional-saju.fullname" .) }}
{{- end }}
{{- end }}

{{/*
App service labels
*/}}
{{- define "traditional-saju.app.labels" -}}
{{ include "traditional-saju.labels" . }}
app.kubernetes.io/component: app
{{- end }}

{{/*
App selector labels
*/}}
{{- define "traditional-saju.app.selectorLabels" -}}
{{ include "traditional-saju.selectorLabels" . }}
app.kubernetes.io/component: app
{{- end }}

{{/*
Migration service labels
*/}}
{{- define "traditional-saju.migration.labels" -}}
{{ include "traditional-saju.labels" . }}
app.kubernetes.io/component: migration
{{- end }}

{{/*
Migration selector labels
*/}}
{{- define "traditional-saju.migration.selectorLabels" -}}
{{ include "traditional-saju.selectorLabels" . }}
app.kubernetes.io/component: migration
{{- end }}

{{/*
ConfigMap names
*/}}
{{- define "traditional-saju.app.configMapName" -}}
{{- printf "%s-app-config" (include "traditional-saju.fullname" .) }}
{{- end }}
