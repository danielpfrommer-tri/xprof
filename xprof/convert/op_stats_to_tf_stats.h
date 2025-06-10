/* Copyright 2019 The TensorFlow Authors. All Rights Reserved.

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

#ifndef XPROF_CONVERT_OP_STATS_TO_TF_STATS_H_
#define XPROF_CONVERT_OP_STATS_TO_TF_STATS_H_

#include <memory>
#include <string>

#include "absl/strings/string_view.h"
#include "xprof/convert/data_table_utils.h"
#include "plugin/xprof/protobuf/op_stats.pb.h"
#include "plugin/xprof/protobuf/tf_stats.pb.h"

namespace tensorflow {
namespace profiler {

TfStatsDatabase ConvertOpStatsToTfStats(const OpStats& op_stats);

std::unique_ptr<DataTable> TfStatsToDataTable(
    const tensorflow::profiler::TfStatsTable& table,
    absl::string_view device_type);

std::string TfStatsToDataTableJson(const TfStatsDatabase& tf_stats_db);

}  // namespace profiler
}  // namespace tensorflow

#endif  // XPROF_CONVERT_OP_STATS_TO_TF_STATS_H_
