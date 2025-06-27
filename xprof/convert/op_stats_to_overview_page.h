/* Copyright 2020 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

#ifndef XPROF_CONVERT_OP_STATS_TO_OVERVIEW_PAGE_H_
#define XPROF_CONVERT_OP_STATS_TO_OVERVIEW_PAGE_H_

#include <memory>
#include <string>

#include "absl/strings/string_view.h"
#include "tsl/profiler/protobuf/xplane.pb.h"
#include "xprof/convert/data_table_utils.h"
#include "plugin/xprof/protobuf/hardware_types.pb.h"
#include "plugin/xprof/protobuf/input_pipeline.pb.h"
#include "plugin/xprof/protobuf/op_metrics.pb.h"
#include "plugin/xprof/protobuf/op_stats.pb.h"
#include "plugin/xprof/protobuf/overview_page.pb.h"

namespace tensorflow {
namespace profiler {

// Reports tf-function optimization opportunity in the Overview Page if the
// expensive-call-time percentage is over this threshold for at least one of
// the tf-functions profiled.
const double kTfFunctionReportThresholdInPercent = 20;

// Reports eager-mode optimization opportunity in the Overview Page if the
// percent of Op time on host (or device) that is spent on eager mode is over
// this threshold.
const double kEagerReportThresholdInPercent = 10;

// Reports outside-compilation opportunity in the Overview Page if the
// percent of Op time on device that is for outside compilation is over
// this threshold.
const double kOutsideCompilationThresholdInPercent = 5;

// Convert a percentage number in double to a string with one decimal place.
std::string StrFormatToPercentage(double num);

void SetCommonRecommendation(
    absl::string_view input_classification, absl::string_view input_statement,
    absl::string_view output_statement, HardwareType hardware_type,
    absl::string_view tf_function_statement_html,
    absl::string_view eager_statement_html,
    absl::string_view outside_compilation_statement_html,
    OverviewPageRecommendation* re);

OverviewPageRecommendation ComputeGenericRecommendation(
    const BottleneckAnalysis& bottleneck,
    const PrecisionStats& precision_stats);

OverviewPageAnalysis ComputeAnalysisResult(const OpStats& op_stats);

OverviewPageRunEnvironment ComputeRunEnvironment(
    const RunEnvironment& run_environment);

OverviewPage ConvertOpStatsToOverviewPage(const OpStats& op_stats);

// Returns a html which provides tf-function related recommendation.
std::string TfFunctionRecommendationHtml(const TfFunctionDb& tf_function_db);

// Returns a html which provides eager-mode related recommendation.
std::string EagerRecommendationHtml(double host_op_time_eager_percent,
                                    double device_op_time_eager_percent);

// Returns a html which provides outside-compilation related recommendation.
std::string OutsideCompilationRecommendationHtml(
    double device_op_time_outside_compilation_percent);

std::unique_ptr<DataTable> GenerateAnalysisResultDataTable(
    const OverviewPage& result);

std::unique_ptr<DataTable> GenerateRunEnvironmentDataTable(
    const OverviewPage& result);

std::unique_ptr<DataTable> GenerateInferenceLatencyDataTable(
    const OverviewInferenceLatency& result);

void GenerateRecommendationResultDataTable(
    const OverviewPage& result, std::unique_ptr<DataTable>& data_table);

std::string OverviewPageToJson(const OverviewPage& result);
}  // namespace profiler
}  // namespace tensorflow

#endif  // XPROF_CONVERT_OP_STATS_TO_OVERVIEW_PAGE_H_
